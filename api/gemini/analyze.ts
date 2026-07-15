import { GoogleGenAI, Type } from "@google/genai";
import { lookupOfficialNutrition, formatOfficialNutritionForPrompt } from "../../lib/foodNutritionApi";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { foodName, conditions } = req.body;
    if (!foodName) {
      return res.status(400).json({ error: "Food name is required" });
    }

    const ai = getAiClient();
    const conditionListStr = Array.isArray(conditions) ? conditions.join(", ") : "없음";
    const officialNutrition = await lookupOfficialNutrition(foodName);

    const prompt = `당신은 제주의 향토 음식 영양 분석 및 위험도를 정밀히 분석하는 의료/웰니스 전문가 AI입니다.
음식 이름: "${foodName}"
사용자의 현재 건강 위험 요인/관심사: [${conditionListStr}] (예: 당뇨, 고혈압, 신장 질환, 알레르기, 비건)
${officialNutrition ? formatOfficialNutritionForPrompt(officialNutrition) : ""}

이 음식에 대해 다음 조건에 맞춰 분석하여 JSON 형태로 반환해 주세요.
- 각 건강 요인별 위험도 점수를 1.0 (매우 안전) ~ 5.0 (극도로 위험) 사이의 실수(float)로 계산하세요.
- 위험도 라벨은 '매우 위험', '위험', '주의', '안전' 중 하나로 설정하세요.
- 사용자가 기입한 건강 요인(예: 당뇨, 고혈압)에 따라 영양소 분석(탄수화물, 나트륨, 당류)을 맞춤으로 수치화하고 직관적으로 설명해 주세요. (예: "78g (높음)", "2,300mg (위험)")
- AI 건강 추천(aiRecommendation)에는 사용자가 안전하게 이 음식을 먹을 수 있는 요령(예: "면은 절반만 먹고 국물은 남기기", "채소를 먼저 충분히 섭취")을 포함하세요.
- '더 건강한 선택(alternative)' 필드에는 제주 향토음식 중 이 요인들을 지닌 사용자에게 아주 안전하고 건강하게 대체할 수 있는 대표 음식을 하나 선정하고, 구체적인 추천 사유를 작성하세요. (예: "제주 돔베고기", "신선한 채소쌈과 함께 수육을 드시는 것이 나트륨과 탄수화물을 획기적으로 줄이는 방법입니다.")`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            riskScoreDiabetes: { type: Type.NUMBER, description: "당뇨 위험 점수 (1.0~5.0)" },
            riskLabelDiabetes: { type: Type.STRING, description: "당뇨 위험 라벨 ('매우 위험', '위험', '주의', '안전')" },
            riskScoreHypertension: { type: Type.NUMBER, description: "고혈압 위험 점수 (1.0~5.0)" },
            riskLabelHypertension: { type: Type.STRING, description: "고혈압 위험 라벨" },
            riskScoreKidney: { type: Type.NUMBER, description: "신장 질환 위험 점수 (1.0~5.0)" },
            riskLabelKidney: { type: Type.STRING, description: "신장 질환 위험 라벨" },
            riskScoreAllergy: { type: Type.NUMBER, description: "알레르기 위험 점수 (1.0~5.0)" },
            riskLabelAllergy: { type: Type.STRING, description: "알레르기 위험 라벨" },
            riskScoreVegan: { type: Type.NUMBER, description: "비건 적합 점수 (1.0~5.0, 1.0이 완전 비건 친화, 5.0이 완전 부적합)" },
            riskLabelVegan: { type: Type.STRING, description: "비건 적합 라벨 ('안전' = 비건 가능, '위험' = 육류 포함 등)" },
            aiRecommendation: { type: Type.STRING, description: "안전하게 먹는 방법 가이드" },
            nutrition: {
              type: Type.OBJECT,
              properties: {
                carbs: { type: Type.STRING, description: "탄수화물 분석 (예: '78g (높음)')" },
                carbsProgress: { type: Type.INTEGER, description: "0~100 사이의 임팩트바 진행율" },
                sodium: { type: Type.STRING, description: "나트륨 분석 (예: '2,300mg (위험)')" },
                sodiumProgress: { type: Type.INTEGER, description: "0~100 사이의 진행율" },
                sugars: { type: Type.STRING, description: "당류 분석 (예: '4g (안전)')" },
                sugarsProgress: { type: Type.INTEGER, description: "0~100 사이의 진행율" }
              },
              required: ["carbs", "carbsProgress", "sodium", "sodiumProgress", "sugars", "sugarsProgress"]
            },
            alternative: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "대체 추천 제주 향토 음식 이름" },
                description: { type: Type.STRING, description: "추천 및 섭취 가이드" }
              },
              required: ["name", "description"]
            }
          },
          required: [
            "foodName", "riskScoreDiabetes", "riskLabelDiabetes", "riskScoreHypertension", "riskLabelHypertension",
            "riskScoreKidney", "riskLabelKidney", "riskScoreAllergy", "riskLabelAllergy", "riskScoreVegan", "riskLabelVegan",
            "aiRecommendation", "nutrition", "alternative"
          ]
        },
      },
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.status(200).json({ ...parsed, isOfficialData: !!officialNutrition });
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze food safety." });
  }
}
