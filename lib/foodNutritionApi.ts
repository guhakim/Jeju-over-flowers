// 식품의약품안전처 식품영양성분DB Open API (서비스ID: I2790)
// https://various.foodsafetykorea.go.kr/nutrient/ 에서 발급받은 키를 FOOD_SAFETY_API_KEY 환경변수로 설정.
// NUTR_CONT1~6 필드 매핑은 공개된 활용 사례들을 참고한 것으로, 정식 Swagger 문서로 재검증 권장.

const API_BASE = "https://openapi.foodsafetykorea.go.kr/api";
const SERVICE_ID = "I2790";

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

  const url = `${API_BASE}/${apiKey}/${SERVICE_ID}/json/1/5/DESC_KOR=${encodeURIComponent(foodName)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data: any = await response.json();
    const row = data?.[SERVICE_ID]?.row?.[0];
    if (!row) return null;

    return {
      foodName: row.DESC_KOR ?? foodName,
      servingSize: row.SERVING_SIZE ? `${row.SERVING_SIZE}${row.SERVING_SIZE_UNIT ?? "g"}` : null,
      calorieKcal: parseNum(row.NUTR_CONT1),
      carbsG: parseNum(row.NUTR_CONT2),
      proteinG: parseNum(row.NUTR_CONT3),
      fatG: parseNum(row.NUTR_CONT4),
      sugarsG: parseNum(row.NUTR_CONT5),
      sodiumMg: parseNum(row.NUTR_CONT6),
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
