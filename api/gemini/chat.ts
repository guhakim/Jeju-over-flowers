import { GoogleGenAI } from "@google/genai";

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
    const { message, history, conditions } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAiClient();
    const conditionListStr = Array.isArray(conditions) ? conditions.join(", ") : "없음";

    const chatHistory = Array.isArray(history) ? history.map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    })) : [];

    const systemInstruction = `당신은 제주의 친절하고 전문적인 웰니스 여행 가이드 "Jeju over Flowers" 비서입니다.
사용자는 제주 여행 중이며 현재 다음과 같은 건강 위험 요인/관심사가 있습니다: [${conditionListStr}]

대답 지침:
1. 사용자의 건강 요인을 바탕으로 제주 향토음식이나 맛집, 일정을 웰니스 관점에서 전문적이고 믿음직스럽게 권장하거나 설명해 주세요.
2. 답변은 친절하고 정중한 한국어로 작성해 주세요. (~해요, ~입니다 체 사용)
3. 너무 딱딱한 임상적 말투보다는 제주 여행의 정취를 해치지 않으면서 실질적으로 유용한 예방 요령을 알려주는 동반자적 톤앤매너를 유지해 주세요.
4. 필요하다면 제주의 구체적인 명소(예: 성산일출봉, 비자림)나 힐링 코스, 병원/약국 검색 팁도 덧붙여 주세요.`;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      history: chatHistory,
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({ message });
    res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat message." });
  }
}
