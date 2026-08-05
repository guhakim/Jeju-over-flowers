// 한국관광공사 국문 관광정보 서비스(KorService2) Open API (공공데이터포털 데이터셋 15101578)
// https://www.data.go.kr/data/15101578/openapi.do 에서 활용신청 후 발급받은 서비스키를
// TOUR_API_KEY 환경변수로 설정 (웰니스/의료관광정보와 동일 서비스 그룹, 같은 키 사용).
// contentTypeId=39(음식점) 카테고리로 조회. 실측 응답 필드로 검증된 매핑 사용.

import { cached } from "./cache.js";
import { fetchWithTimeout } from "./httpUtils.js";

const API_URL = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2";
const SEARCH_API_URL = "https://apis.data.go.kr/B551011/KorService2/searchKeyword2";

const JEJU_AREA_CODE = "39"; // KorService 지역코드: 제주
const RESTAURANT_CONTENT_TYPE_ID = "39"; // 관광타입 ID: 음식점

export interface RestaurantSpot {
  contentId: string;
  title: string;
  address: string;
  imageUrl: string | null;
  tel: string;
}

export interface FoodPhoto {
  imageUrl: string;
  venueName: string;
}

function toItemList(items: any): any[] {
  if (Array.isArray(items)) return items;
  if (items?.item) return Array.isArray(items.item) ? items.item : [items.item];
  return [];
}

export function getJejuRestaurants(): Promise<RestaurantSpot[] | null> {
  return cached("restaurants:jeju", fetchJejuRestaurants, {
    successTtlMs: 60 * 60 * 1000,
    failureTtlMs: 60 * 1000,
  });
}

async function fetchJejuRestaurants(): Promise<RestaurantSpot[] | null> {
  const apiKey = process.env.TOUR_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    serviceKey: apiKey,
    MobileOS: "ETC",
    MobileApp: "JejuOverFlowers",
    contentTypeId: RESTAURANT_CONTENT_TYPE_ID,
    areaCode: JEJU_AREA_CODE,
    arrange: "A", // 제목순 정렬 ("O"=이미지 有 전용 정렬은 공급기관 서버에서 SQL 오류 발생 이력 있음)
    numOfRows: "20",
    pageNo: "1",
    _type: "json",
  });

  try {
    const response = await fetchWithTimeout(`${API_URL}?${params.toString()}`);
    const bodyText = await response.text();

    if (!response.ok) {
      console.error("KorService2 API HTTP error:", response.status, bodyText.slice(0, 500));
      return null;
    }

    const root = JSON.parse(bodyText)?.response;
    if (root?.header?.resultCode !== "0000") {
      console.error("KorService2 API result error:", root?.header, bodyText.slice(0, 500));
      return null;
    }

    const spots = toItemList(root?.body?.items)
      .map((item: any) => ({
        contentId: item.contentid ?? "",
        title: item.title ?? "",
        address: item.addr1 ?? "",
        imageUrl: item.firstimage || null,
        tel: item.tel ?? "",
      }))
      .filter((s) => s.title);

    return spots.length > 0 ? spots : null;
  } catch (error) {
    console.error("KorService2 API error:", error);
    return null;
  }
}

// 음식명으로 제주 실제 식당을 검색해 대표 이미지를 찾는다. AI로 사진을 새로 만들지 않고
// 관광공사가 이미 보유한 진짜 매장 사진을 재사용하는 방식이라 별도 비용/쿼터가 들지 않는다.
export function searchJejuFoodPhoto(foodName: string): Promise<FoodPhoto | null> {
  return cached(`food-photo-search:${foodName}`, () => fetchJejuFoodPhoto(foodName), {
    successTtlMs: 7 * 24 * 60 * 60 * 1000,
    failureTtlMs: 60 * 60 * 1000,
  });
}

async function fetchJejuFoodPhoto(foodName: string): Promise<FoodPhoto | null> {
  const apiKey = process.env.TOUR_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    serviceKey: apiKey,
    MobileOS: "ETC",
    MobileApp: "JejuOverFlowers",
    keyword: foodName,
    contentTypeId: RESTAURANT_CONTENT_TYPE_ID,
    areaCode: JEJU_AREA_CODE,
    arrange: "A",
    numOfRows: "10",
    pageNo: "1",
    _type: "json",
  });

  try {
    const response = await fetchWithTimeout(`${SEARCH_API_URL}?${params.toString()}`);
    const bodyText = await response.text();

    if (!response.ok) {
      console.error("KorService2 searchKeyword2 HTTP error:", response.status, bodyText.slice(0, 500));
      return null;
    }

    const root = JSON.parse(bodyText)?.response;
    if (root?.header?.resultCode !== "0000") {
      console.error("KorService2 searchKeyword2 result error:", root?.header, bodyText.slice(0, 500));
      return null;
    }

    const withImage = toItemList(root?.body?.items).find((item: any) => item.firstimage);
    if (!withImage) return null;

    return { imageUrl: withImage.firstimage, venueName: withImage.title ?? "" };
  } catch (error) {
    console.error("KorService2 searchKeyword2 error:", error);
    return null;
  }
}
