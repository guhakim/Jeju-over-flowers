// 큐레이션된 5개 카테고리 사진에 안 걸리는 음식명을 위해 Gemini 이미지 생성 모델로
// 대표 사진을 실시간 생성한다. 실패하거나 키가 없으면 null을 반환해서 프론트가
// 아이콘 플레이스홀더로 자연스럽게 대체하도록 한다.

import { GoogleGenAI, Modality } from "@google/genai";
import { cached } from "./cache.js";

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

export function generateFoodImage(foodName: string): Promise<string | null> {
  return cached(`food-image:${foodName}`, () => fetchGeneratedFoodImage(foodName), {
    successTtlMs: 7 * 24 * 60 * 60 * 1000,
    failureTtlMs: 60 * 1000,
  });
}

async function fetchGeneratedFoodImage(foodName: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image",
      contents: `제주 향토 음식점에서 나올 법한 "${foodName}" 요리의 고급 푸드 포토그래피. 접시에 정갈하게 플레이팅, 자연광, 상단 뷰 또는 45도 각도, 배경은 은은하게 블러 처리. 텍스트나 로고는 넣지 마세요.`,
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData?.data);
    if (!imagePart?.inlineData?.data) return null;

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    return `data:${mimeType};base64,${imagePart.inlineData.data}`;
  } catch (error) {
    console.error("Food image generation error:", error);
    return null;
  }
}
