// 한국관광공사 의료관광정보 Open API (공공데이터포털 데이터셋 15143913)
// https://www.data.go.kr/data/15143913/openapi.do 에서 활용신청 후 발급받은 서비스키를
// TOUR_API_KEY 환경변수로 설정 (웰니스관광정보와 동일 서비스 그룹, 같은 키 사용).
// Swagger 명세(areaBasedList)로 검증된 필드 매핑. langDivCd는 KOR을 지원하지 않아 ENG로 조회 후
// 응답 제목에 포함된 국문명("영문명 (국문명)")을 파싱해서 사용합니다.

import { cached } from "./cache.js";
import { fetchWithTimeout } from "./httpUtils.js";

const API_URL = "https://apis.data.go.kr/B551011/MdclTursmService/areaBasedList";

const JEJU_REGION_CODE = "50"; // 법정동 시도코드: 제주특별자치도

export interface MedicalTourismSpot {
  contentId: string;
  name: string;
  address: string;
  tel: string;
}

function toItemList(items: any): any[] {
  if (Array.isArray(items)) return items;
  if (items?.item) return Array.isArray(items.item) ? items.item : [items.item];
  return [];
}

// "Jeju National University Hospital (제주대학교병원)" -> "제주대학교병원"
// 국문명 자체에 괄호가 포함된 경우("...(재)한국의학연구소 제주의원)")도 있어 괄호 깊이를 세어
// 마지막 ')'와 짝이 맞는 가장 바깥쪽 '('를 찾는다.
function extractKoreanName(title: string): string {
  const trimmed = title.trim();
  if (!trimmed.endsWith(")")) return trimmed;

  let depth = 0;
  for (let i = trimmed.length - 1; i >= 0; i--) {
    if (trimmed[i] === ")") depth++;
    else if (trimmed[i] === "(") {
      depth--;
      if (depth === 0) {
        const inner = trimmed.slice(i + 1, -1).trim();
        return inner || trimmed;
      }
    }
  }
  return trimmed;
}

export function getJejuMedicalTourismSpots(): Promise<MedicalTourismSpot[] | null> {
  return cached("medical-tourism-spots:jeju", fetchJejuMedicalTourismSpots, {
    successTtlMs: 60 * 60 * 1000,
    failureTtlMs: 60 * 1000,
  });
}

async function fetchJejuMedicalTourismSpots(): Promise<MedicalTourismSpot[] | null> {
  const apiKey = process.env.TOUR_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    serviceKey: apiKey,
    MobileOS: "ETC",
    MobileApp: "JejuOverFlowers",
    langDivCd: "ENG", // 이 API는 KOR 언어코드를 지원하지 않음
    lDongRegnCd: JEJU_REGION_CODE,
    arrange: "A",
    numOfRows: "20",
    pageNo: "1",
    _type: "json",
  });

  try {
    const response = await fetchWithTimeout(`${API_URL}?${params.toString()}`);
    const bodyText = await response.text();

    if (!response.ok) {
      console.error("MdclTursmService API HTTP error:", response.status, bodyText.slice(0, 500));
      return null;
    }

    const root = JSON.parse(bodyText)?.response;
    if (root?.header?.resultCode !== "0000") {
      console.error("MdclTursmService API result error:", root?.header, bodyText.slice(0, 500));
      return null;
    }

    const spots = toItemList(root?.body?.items)
      .map((item: any) => ({
        contentId: item.contentId ?? "",
        name: extractKoreanName(item.title ?? ""),
        address: item.baseAddr ?? "",
        tel: item.tel ?? "",
      }))
      .filter((s) => s.name);

    return spots.length > 0 ? spots : null;
  } catch (error) {
    console.error("MdclTursmService API error:", error);
    return null;
  }
}
