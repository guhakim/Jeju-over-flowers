// 한국관광공사 국문 관광정보 서비스(KorService2) Open API (공공데이터포털 데이터셋 15101578)
// https://www.data.go.kr/data/15101578/openapi.do 에서 활용신청 후 발급받은 서비스키를
// TOUR_API_KEY 환경변수로 설정 (웰니스/의료관광정보와 동일 서비스 그룹, 같은 키 사용).
// contentTypeId=39(음식점) 카테고리로 조회. 실측 응답 필드로 검증된 매핑 사용.

import { cached } from "./cache.js";
import { fetchWithTimeout } from "./httpUtils.js";

const API_URL = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2";

const JEJU_AREA_CODE = "39"; // KorService 지역코드: 제주
const RESTAURANT_CONTENT_TYPE_ID = "39"; // 관광타입 ID: 음식점

export interface RestaurantSpot {
  contentId: string;
  title: string;
  address: string;
  imageUrl: string | null;
  tel: string;
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
        // TourAPI가 http:// 이미지 URL을 내려줄 때가 있는데, 배포 환경은 HTTPS라 브라우저가
        // 혼합 콘텐츠로 차단해 사진이 아예 안 뜬다. CDN이 https도 지원하므로 프로토콜만 승격.
        imageUrl: item.firstimage ? item.firstimage.replace(/^http:\/\//, "https://") : null,
        tel: item.tel ?? "",
      }))
      .filter((s) => s.title);

    return spots.length > 0 ? spots : null;
  } catch (error) {
    console.error("KorService2 API error:", error);
    return null;
  }
}
