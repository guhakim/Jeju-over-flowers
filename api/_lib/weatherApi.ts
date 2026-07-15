// 한국환경공단 에어코리아 대기오염정보 (데이터셋 15073861) +
// 기상청 생활기상지수(자외선지수) 조회서비스(3.0) (데이터셋 15085288)
// data.go.kr 계정당 서비스키가 1개라 FOOD_SAFETY_API_KEY 값을 재사용합니다.

const AIR_API_URL = "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty";
const UV_API_URL = "https://apis.data.go.kr/1360000/LivingWthrIdxServiceV5/getUVIdxV5";
const JEJU_CITY_AREA_NO = "5011000000"; // 제주특별자치도 제주시

export interface AirQuality {
  stationName: string;
  pm10Value: number | null;
  pm25Value: number | null;
  khaiValue: number | null;
  grade: "좋음" | "보통" | "나쁨" | "매우나쁨" | null;
}

export interface UvIndex {
  value: number | null;
  grade: "낮음" | "보통" | "높음" | "매우높음" | "위험" | null;
}

function unwrapResponse(data: any): any {
  return data?.response ?? data;
}

function toItemList(items: any): any[] {
  if (Array.isArray(items)) return items;
  if (items?.item) return Array.isArray(items.item) ? items.item : [items.item];
  return [];
}

function parseNum(value: unknown): number | null {
  if (value === undefined || value === null || value === "-" || value === "") return null;
  const n = parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

const KHAI_GRADE_LABELS: Record<string, AirQuality["grade"]> = {
  "1": "좋음",
  "2": "보통",
  "3": "나쁨",
  "4": "매우나쁨",
};

export async function getJejuAirQuality(): Promise<AirQuality | null> {
  const apiKey = process.env.FOOD_SAFETY_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    serviceKey: apiKey,
    returnType: "json",
    sidoName: "제주",
    pageNo: "1",
    numOfRows: "20",
    ver: "1.0",
  });

  try {
    const response = await fetch(`${AIR_API_URL}?${params.toString()}`);
    const bodyText = await response.text();

    if (!response.ok) {
      console.error("AirKorea API HTTP error:", response.status, bodyText.slice(0, 500));
      return null;
    }

    const root = unwrapResponse(JSON.parse(bodyText));
    const list = toItemList(root?.body?.items);

    // 점검/교정 중인 측정소를 건너뛰고 실측값이 있는 첫 측정소를 사용
    const station = list.find((item) => parseNum(item.pm10Value) !== null);
    if (!station) return null;

    return {
      stationName: station.stationName ?? "제주",
      pm10Value: parseNum(station.pm10Value),
      pm25Value: parseNum(station.pm25Value),
      khaiValue: parseNum(station.khaiValue),
      grade: KHAI_GRADE_LABELS[station.khaiGrade] ?? null,
    };
  } catch (error) {
    console.error("AirKorea API error:", error);
    return null;
  }
}

function getLatestIssuance(): { time: string; issuedAt: number } {
  const nowKst = Date.now() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(nowKst);
  const hour = kstDate.getUTCHours();
  const issuanceHour = hour >= 18 ? 18 : hour >= 6 ? 6 : 18;

  const issued = new Date(kstDate);
  issued.setUTCHours(issuanceHour, 0, 0, 0);
  if (hour < 6) {
    issued.setUTCDate(issued.getUTCDate() - 1);
  }

  const y = issued.getUTCFullYear();
  const m = String(issued.getUTCMonth() + 1).padStart(2, "0");
  const d = String(issued.getUTCDate()).padStart(2, "0");
  const h = String(issued.getUTCHours()).padStart(2, "0");

  return { time: `${y}${m}${d}${h}`, issuedAt: issued.getTime() };
}

function uvGrade(value: number): UvIndex["grade"] {
  if (value >= 11) return "위험";
  if (value >= 8) return "매우높음";
  if (value >= 6) return "높음";
  if (value >= 3) return "보통";
  return "낮음";
}

async function fetchUvForIssuance(apiKey: string, time: string): Promise<{ nowStep: number; item: any } | null> {
  const params = new URLSearchParams({
    ServiceKey: apiKey,
    areaNo: JEJU_CITY_AREA_NO,
    time,
    dataType: "json",
    pageNo: "1",
    numOfRows: "10",
  });

  const response = await fetch(`${UV_API_URL}?${params.toString()}`);
  const bodyText = await response.text();
  if (!response.ok) {
    console.error("KMA UV API HTTP error:", response.status, bodyText.slice(0, 500));
    return null;
  }

  const root = unwrapResponse(JSON.parse(bodyText));
  const list = toItemList(root?.body?.items);
  const item = list[0];
  return item ? { nowStep: 0, item } : null;
}

export async function getJejuUvIndex(): Promise<UvIndex | null> {
  const apiKey = process.env.FOOD_SAFETY_API_KEY;
  if (!apiKey) return null;

  try {
    const { time, issuedAt } = getLatestIssuance();
    let result = await fetchUvForIssuance(apiKey, time);

    if (!result) {
      // 최신 발표자료가 아직 안 올라온 경우 직전 발표(12시간 전)로 재시도
      const prevIssued = new Date(issuedAt - 12 * 60 * 60 * 1000);
      const y = prevIssued.getUTCFullYear();
      const m = String(prevIssued.getUTCMonth() + 1).padStart(2, "0");
      const d = String(prevIssued.getUTCDate()).padStart(2, "0");
      const h = String(prevIssued.getUTCHours()).padStart(2, "0");
      result = await fetchUvForIssuance(apiKey, `${y}${m}${d}${h}`);
    }

    if (!result) return null;

    const elapsedHours = Math.round((Date.now() - issuedAt) / (60 * 60 * 1000));
    const step = Math.min(75, Math.max(0, Math.round(elapsedHours / 3) * 3));
    const raw = result.item[`h${step}`];
    const value = parseNum(raw);
    if (value === null) return null;

    return { value, grade: uvGrade(value) };
  } catch (error) {
    console.error("KMA UV API error:", error);
    return null;
  }
}
