// 식품의약품안전처 식품영양성분DB Open API (공공데이터포털 데이터셋 15127578)
// https://www.data.go.kr/data/15127578/openapi.do 에서 발급받은 서비스키(디코딩 키 권장)를
// FOOD_SAFETY_API_KEY 환경변수로 설정. Swagger 명세(getFoodNtrCpntDbInq02)로 검증된 필드 매핑 사용.

const API_URL = "https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02";

export interface OfficialNutrition {
  foodName: string;
  servingSize: string | null;
  calorieKcal: number | null;
  carbsG: number | null;
  proteinG: number | null;
  fatG: number | null;
  sugarsG: number | null;
  sodiumMg: number | null;
}

function parseNum(value: unknown): number | null {
  const n = parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

export async function lookupOfficialNutrition(foodName: string): Promise<OfficialNutrition | null> {
  const apiKey = process.env.FOOD_SAFETY_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    serviceKey: apiKey,
    type: "json",
    numOfRows: "5",
    pageNo: "1",
    FOOD_NM_KR: foodName,
  });

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);
    const bodyText = await response.text();

    if (!response.ok) {
      console.error("FoodSafetyKorea API HTTP error:", response.status, bodyText.slice(0, 500));
      return null;
    }

    const data: any = JSON.parse(bodyText);
    const rawItems = data?.body?.items;
    const items = Array.isArray(rawItems) ? rawItems : rawItems?.item;
    const row = Array.isArray(items) ? items[0] : items;
    if (!row) {
      console.error("FoodSafetyKorea API no match:", data?.header, bodyText.slice(0, 500));
      return null;
    }

    return {
      foodName: row.FOOD_NM_KR ?? foodName,
      servingSize: row.SERVING_SIZE ? String(row.SERVING_SIZE) : null,
      calorieKcal: parseNum(row.AMT_NUM1),
      proteinG: parseNum(row.AMT_NUM3),
      fatG: parseNum(row.AMT_NUM4),
      carbsG: parseNum(row.AMT_NUM6),
      sugarsG: parseNum(row.AMT_NUM7),
      sodiumMg: parseNum(row.AMT_NUM13),
    };
  } catch (error) {
    console.error("FoodSafetyKorea API error:", error);
    return null;
  }
}

export function formatOfficialNutritionForPrompt(n: OfficialNutrition): string {
  return `

[식약처 식품영양성분DB 공식 데이터 - 반드시 이 수치를 근거로 사용하세요. 임의로 다른 수치를 창작하지 마세요]
- 기준량: ${n.servingSize ?? "정보 없음"}
- 열량: ${n.calorieKcal ?? "정보 없음"}kcal
- 탄수화물: ${n.carbsG ?? "정보 없음"}g
- 단백질: ${n.proteinG ?? "정보 없음"}g
- 지방: ${n.fatG ?? "정보 없음"}g
- 당류: ${n.sugarsG ?? "정보 없음"}g
- 나트륨: ${n.sodiumMg ?? "정보 없음"}mg

nutrition 필드의 carbs/sodium/sugars 값은 위 공식 수치를 그대로 사용해서 작성하세요 (예: 탄수화물이 78이면 "78g (높음)").`;
}
