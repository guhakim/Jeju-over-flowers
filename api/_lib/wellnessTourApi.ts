// 한국관광공사 웰니스관광정보 Open API (공공데이터포털 데이터셋 15144030)
// https://www.data.go.kr/data/15144030/openapi.do 에서 활용신청 후 발급받은 서비스키를
// TOUR_API_KEY 환경변수로 설정. Swagger 명세(areaBasedList)로 검증된 필드 매핑.

import { cached } from "./cache.js";
import { fetchWithTimeout } from "./httpUtils.js";

const AREA_BASED_URL = "https://apis.data.go.kr/B551011/WellnessTursmService/areaBasedList";
// 위치 기반(거리순) 조회 — mapX(경도)/mapY(위도)/radius(m), 실제 호출로 응답 필드(dist 포함) 검증 완료.
const LOCATION_BASED_URL = "https://apis.data.go.kr/B551011/WellnessTursmService/locationBasedList";

const JEJU_REGION_CODE = "50"; // 법정동 시도코드: 제주특별자치도

const WELLNESS_THEME_LABELS: Record<string, string> = {
  EX050100: "온천·사우나·스파",
  EX050200: "찜질방",
  EX050300: "한방 체험",
  EX050400: "힐링 명상",
  EX050500: "뷰티 스파",
  EX050600: "기타 웰니스",
  EX050700: "자연 치유",
};

export interface WellnessCoords {
  lat: number;
  lng: number;
  radiusM?: number;
}

export interface WellnessSpot {
  contentId: string;
  title: string;
  address: string;
  theme: string;
  imageUrl: string | null;
  tel: string;
  distanceM: number | null;
}

function toItemList(items: any): any[] {
  if (Array.isArray(items)) return items;
  if (items?.item) return Array.isArray(items.item) ? items.item : [items.item];
  return [];
}

// 쿼리스트링(lat/lng/radius)을 좌표로 파싱. 값이 없거나 숫자가 아니면 지역 전체 조회로 폴백하도록 undefined 반환.
export function parseCoordsFromQuery(query: Record<string, any>): WellnessCoords | undefined {
  const lat = parseFloat(query?.lat);
  const lng = parseFloat(query?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  const radiusM = parseFloat(query?.radius);
  return { lat, lng, radiusM: Number.isFinite(radiusM) ? radiusM : undefined };
}

export function getJejuWellnessSpots(coords?: WellnessCoords): Promise<WellnessSpot[] | null> {
  const cacheKey = coords
    ? `wellness-spots:near:${coords.lat.toFixed(3)},${coords.lng.toFixed(3)}`
    : "wellness-spots:jeju";
  return cached(cacheKey, () => fetchJejuWellnessSpots(coords), {
    successTtlMs: 60 * 60 * 1000,
    failureTtlMs: 60 * 1000,
  });
}

async function fetchJejuWellnessSpots(coords?: WellnessCoords): Promise<WellnessSpot[] | null> {
  const apiKey = process.env.TOUR_API_KEY;
  if (!apiKey) return null;

  const baseParams: Record<string, string> = {
    serviceKey: apiKey,
    MobileOS: "ETC",
    MobileApp: "JejuOverFlowers",
    langDivCd: "KOR",
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
          radius: String(coords.radiusM ?? 5000),
          arrange: "E", // 거리순 정렬
        }
      : {
          ...baseParams,
          lDongRegnCd: JEJU_REGION_CODE,
          arrange: "A", // 제목순 정렬 ("O"=이미지 有 전용 정렬은 공급기관 서버에서 SQL 오류(orgImage 컬럼) 발생)
        }
  );

  try {
    const response = await fetchWithTimeout(`${apiUrl}?${params.toString()}`);
    const bodyText = await response.text();

    if (!response.ok) {
      console.error("WellnessTursmService API HTTP error:", response.status, bodyText.slice(0, 500));
      return null;
    }

    const root = JSON.parse(bodyText)?.response;
    if (root?.header?.resultCode !== "0000") {
      console.error("WellnessTursmService API result error:", root?.header, bodyText.slice(0, 500));
      return null;
    }

    const spots = toItemList(root?.body?.items)
      .map((item: any) => ({
        contentId: item.contentId ?? "",
        title: item.title ?? "",
        address: item.baseAddr ?? "",
        theme: WELLNESS_THEME_LABELS[item.wellnessThemaCd] ?? "웰니스",
        // TourAPI가 http:// 이미지 URL을 내려줄 때가 있는데, 배포 환경은 HTTPS라 브라우저가
        // 혼합 콘텐츠로 차단해 사진이 아예 안 뜬다. CDN이 https도 지원하므로 프로토콜만 승격.
        imageUrl: item.firstimage ? item.firstimage.replace(/^http:\/\//, "https://") : null,
        tel: item.tel ?? "",
        distanceM: item.dist != null ? Math.round(parseFloat(item.dist)) : null,
      }))
      .filter((s) => s.title);

    return spots.length > 0 ? spots : null;
  } catch (error) {
    console.error("WellnessTursmService API error:", error);
    return null;
  }
}
