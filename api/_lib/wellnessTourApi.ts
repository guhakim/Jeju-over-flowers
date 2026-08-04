// 한국관광공사 웰니스관광정보 Open API (공공데이터포털 데이터셋 15144030)
// https://www.data.go.kr/data/15144030/openapi.do 에서 활용신청 후 발급받은 서비스키를
// TOUR_API_KEY 환경변수로 설정. Swagger 명세(areaBasedList)로 검증된 필드 매핑.

const API_URL = "https://apis.data.go.kr/B551011/WellnessTursmService/areaBasedList";

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

export interface WellnessSpot {
  contentId: string;
  title: string;
  address: string;
  theme: string;
  imageUrl: string | null;
  tel: string;
}

function toItemList(items: any): any[] {
  if (Array.isArray(items)) return items;
  if (items?.item) return Array.isArray(items.item) ? items.item : [items.item];
  return [];
}

export async function getJejuWellnessSpots(): Promise<WellnessSpot[] | null> {
  const apiKey = process.env.TOUR_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    serviceKey: apiKey,
    MobileOS: "ETC",
    MobileApp: "JejuOverFlowers",
    langDivCd: "KOR",
    lDongRegnCd: JEJU_REGION_CODE,
    arrange: "A", // 제목순 정렬 ("O"=이미지 有 전용 정렬은 공급기관 서버에서 SQL 오류(orgImage 컬럼) 발생)
    numOfRows: "20",
    pageNo: "1",
    _type: "json",
  });

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);
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
        imageUrl: item.firstimage || null,
        tel: item.tel ?? "",
      }))
      .filter((s) => s.title);

    return spots.length > 0 ? spots : null;
  } catch (error) {
    console.error("WellnessTursmService API error:", error);
    return null;
  }
}
