// 한국관광공사 국문 관광정보 서비스(KorService2) Open API (공공데이터포털 데이터셋 15101578)
// https://www.data.go.kr/data/15101578/openapi.do 에서 활용신청 후 발급받은 서비스키를
// TOUR_API_KEY 환경변수로 설정 (웰니스/의료관광정보와 동일 서비스 그룹, 같은 키 사용).
// contentTypeId=39(음식점) 카테고리로 조회. 실측 응답 필드로 검증된 매핑 사용.

import { cached } from "./cache.js";
import { fetchWithTimeout } from "./httpUtils.js";

const AREA_BASED_URL = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2";
// 위치 기반(거리순) 조회 — mapX(경도)/mapY(위도)/radius(m) 파라미터로 현재 위치 반경 내 결과를 거리순(arrange=E)으로 반환.
// 실제 호출로 응답 필드(dist 포함)를 검증한 뒤 반영.
const LOCATION_BASED_URL = "https://apis.data.go.kr/B551011/KorService2/locationBasedList2";

const JEJU_AREA_CODE = "39"; // KorService 지역코드: 제주
const RESTAURANT_CONTENT_TYPE_ID = "39"; // 관광타입 ID: 음식점

export interface RestaurantCoords {
  lat: number;
  lng: number;
  radiusM?: number;
}

export interface RestaurantSpot {
  contentId: string;
  title: string;
  address: string;
  imageUrl: string | null;
  tel: string;
  distanceM: number | null;
  lat: number | null;
  lng: number | null;
}

function toItemList(items: any): any[] {
  if (Array.isArray(items)) return items;
  if (items?.item) return Array.isArray(items.item) ? items.item : [items.item];
  return [];
}

// 쿼리스트링(lat/lng/radius)을 좌표로 파싱. 값이 없거나 숫자가 아니면 지역 전체 조회로 폴백하도록 undefined 반환.
export function parseCoordsFromQuery(query: Record<string, any>): RestaurantCoords | undefined {
  const lat = parseFloat(query?.lat);
  const lng = parseFloat(query?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  const radiusM = parseFloat(query?.radius);
  return { lat, lng, radiusM: Number.isFinite(radiusM) ? radiusM : undefined };
}

export function getJejuRestaurants(coords?: RestaurantCoords): Promise<RestaurantSpot[] | null> {
  // 좌표를 소수점 3자리(약 110m)로 반올림해 근처 요청끼리 캐시를 공유하게 한다.
  const cacheKey = coords
    ? `restaurants:near:${coords.lat.toFixed(3)},${coords.lng.toFixed(3)}`
    : "restaurants:jeju";
  return cached(cacheKey, () => fetchJejuRestaurants(coords), {
    successTtlMs: 60 * 60 * 1000,
    failureTtlMs: 60 * 1000,
  });
}

async function fetchJejuRestaurants(coords?: RestaurantCoords): Promise<RestaurantSpot[] | null> {
  const apiKey = process.env.TOUR_API_KEY;
  if (!apiKey) return null;

  const baseParams: Record<string, string> = {
    serviceKey: apiKey,
    MobileOS: "ETC",
    MobileApp: "JejuOverFlowers",
    contentTypeId: RESTAURANT_CONTENT_TYPE_ID,
    numOfRows: "20",
    pageNo: "1",
    _type: "json",
  };

  const apiUrl = coords ? LOCATION_BASED_URL : AREA_BASED_URL;
  const params = new URLSearchParams(
    coords
      ? {
          ...baseParams,
          mapX: String(coords.lng),
          mapY: String(coords.lat),
          radius: String(coords.radiusM ?? 3000),
          arrange: "E", // 거리순 정렬
        }
      : {
          ...baseParams,
          areaCode: JEJU_AREA_CODE,
          arrange: "A", // 제목순 정렬 ("O"=이미지 有 전용 정렬은 공급기관 서버에서 SQL 오류 발생 이력 있음)
        }
  );

  try {
    const response = await fetchWithTimeout(`${apiUrl}?${params.toString()}`);
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
        distanceM: item.dist != null ? Math.round(parseFloat(item.dist)) : null,
        // mapx=경도(lng), mapy=위도(lat) — KorService2 실측 응답 필드로 검증된 명명.
        lat: item.mapy != null ? parseFloat(item.mapy) : null,
        lng: item.mapx != null ? parseFloat(item.mapx) : null,
      }))
      .filter((s) => s.title);

    return spots.length > 0 ? spots : null;
  } catch (error) {
    console.error("KorService2 API error:", error);
    return null;
  }
}
