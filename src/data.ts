import { HealthCondition, ItineraryItem, FoodItem, NutritionAnalysis } from "./types";

export const HEALTH_CONDITIONS: HealthCondition[] = [
  {
    id: "diabetes",
    name: "당뇨",
    description: "저혈당 지수 모니터링",
    icon: "Activity",
  },
  {
    id: "hypertension",
    name: "고혈압",
    description: "나트륨 섭취 주의",
    icon: "Heart",
  },
  {
    id: "kidney",
    name: "신장 질환",
    description: "칼륨/인 추적 관리",
    icon: "LayoutGrid",
  },
  {
    id: "allergy",
    name: "알레르기",
    description: "성분 교차 검증",
    icon: "UtensilsCrossed",
  },
  {
    id: "vegan",
    name: "비건",
    description: "식물성 식단 필터",
    icon: "Leaf",
  },
];

export const WELLNESS_ITINERARY: ItineraryItem[] = [
  {
    id: "itinerary-1",
    time: "오전 • 08:30 AM",
    title: "성산일출봉 (가벼운 산책)",
    description: "완만한 일출 감상. 경사도 3% (평지). 무장애 데크길 이용 가능.",
    intensity: "저강도",
    tag: "저강도",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3DGa7mqQFyvrYEaH63FYzcvinMWWeD72LYUCnRiGtrF1_FpDSKTRbIJpHy5Gu__GXYtgkWB5behNXi9yi1YzuxbmkPX61_KnKgY67OWV-5uoCTCVmicgJ4etgP2TBKXWHBXVMUIrFxXLJntdy-kw-aJma9Z315-_PLVOGTZIKEtSjcJJ85UXa69VxUV5V24emvVYyVKHg3wlN9rQNKcuL0NSgY-VA_YvMSOlAwwMLweYr8oHg3agdLlZgTBHuauKt53l85hz1vpdN",
  },
  {
    id: "itinerary-2",
    time: "점심 • 12:30 PM",
    title: "그린테이블 제주",
    description: "추천 메뉴: 보리밥을 곁들인 고등어 구이. AI가 확인한 저나트륨 조리법.",
    intensity: "저나트륨",
    tag: "저나트륨",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYc9GXnu4ZL5qigeDuC5FPe6AzC4vavgQpF0UdsImWo1zQwFNbVzr9dquEvzAg6y4SEhMuJMz2MXPL84T_3HKiB4EkycEGOjca54E6zukX1-IZlrD5ofYcqI7uijM9lgBY9iGOFUVXLMU_rkSfOGitzRqAOC7f-LvUdzsx3CyeKw9-t3t2LYmFqojBqcWtH0uRSuksYoUmBU3KP0m_hnv8zt5CpngQcFDrKt9QC2XPJ4y60udRy1KzkqOFzVHeTztD2f0DRl9eTyd9",
  },
  {
    id: "itinerary-3",
    time: "오후 • 03:00 PM",
    title: "올레길 1코스",
    description: "500m마다 휴식처가 있는 해안 구간. 경로 내 AED 2곳 위치.",
    intensity: "무장애 경로",
    tag: "무장애 경로",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPh4LogMBuJTiFuk4ZkzcrBdfznTEHPNCa6DPUYT-GI4EdhSlGVERKP_zbmRweyvPvgz5dYsHvdPvZdX-nudz6HLWBQe8mx2HPE2ws2-XWwsUKV9kiDFeGN0fAjBZ_K_BLOUnUe9cLZ9PZUezVh98nXZbCy8CqoJpkhtI7DQkqqKvFoUONkYXJ4le1kYxc4qYSnOoaecAUDDwSrC06qfDVRedeRzfaLXqy8nUABCEwNbUeuo1PUmRXNCg2RSs8HiJqehT-NyeeepJa",
  },
  {
    id: "itinerary-4",
    time: "카페 • 05:00 PM",
    title: "시트러스 그로브 카페",
    description: "당분 걱정 없는 무설탕 한라봉 차. 혈당 관리에 적합한 음료.",
    intensity: "무설탕",
    tag: "무설탕",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgA-1-HkWk5EdxFhWf56jin0W24BYmMjV0CxNQ4PhXlLuPImCX476YKvqUItorYiqURUlXxt33FaxfGsITp4bNB3ti3CQPFbfDFQ-UBB-GKVyq9gEbuPlTH66TF8P8RQ3ltSBrkKapX-yMvkiWILwYZgEU1rud-uvho8Fs38RydYXOkeRBwVd2n6K2q3PSx73YgjIpo5UOpBsV_Md23V6nwvoD9-Of4I2vDG6wd9cj1rIU29LpVts7aWx1rfurYZmReNevr-ia-l9d",
  },
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: "food-1",
    name: "제주 흑돼지",
    description: "계절 나물을 곁들인 저지방 목살 구이",
    rating: 5.0,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB14sc4YnFjO6EMzRa545_QwoyRbUAMHsR7DalF7Ux5PXpBpD71MzItIHNv1l_2m07vv1v2SR4UlqiB-ZsgZFGxnKp7ujnFZNgP5KpKnAOvUX-xTa9TaE-PaFkqlrkNaCukXx5UFckKx8zLGw1GXI64BaK0zJps89mCneiU42oeR5pjDlM8I7KOWdbsb4iDr-SXKvOFQs_RaCkif9BxmAeVRWbbZmQm1LUbZHPljxjC0DfT1QO77NjP2b543o96-iJ2r-Zuau3cJT6C",
    tags: ["저당", "고단백"],
  },
  {
    id: "food-2",
    name: "전복죽",
    description: "신선한 전복과 통곡물 쌀로 정성껏 끓인 영양죽",
    rating: 4.9,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcHjS51V5YuPdDvFKq2DbP7ZmFr-Gjh2Be4WsxOBp6F-V_Fv1oC2UxAp0RAAlg_Qs4vuApo24EsbqMTYpWIPdZF_tgNDctySYzP5yaCQ60qsxKc53nIZXBS0zS9pIN6Pvfe5_TPKfx-mlzkZ3LfGoUJnAt-E6ayv2ww0SqyDrCaQaTphbj6m29aZ89NURo1Gy8FK6CQRuISQREGqUO0ZZoC3jb1HmgCiDwZIuWmsYN7qsuL_zSd6zlkQcjSKHNszmbgNxleXQ5282b",
    tags: ["소화 용이", "미네랄 풍부"],
  },
  {
    id: "food-3",
    name: "옥돔 구이",
    description: "레몬을 곁들인 저염 시즈닝의 자연산 옥돔 구이",
    rating: 4.8,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUfZ3rY4ZGub0JE4NdcgMkirSOtHlXgHYYKSOZINrC4x3RpAvrPtBzI44aZ_q-EF7pTBa0uTCp170b4L1h5vHBd7NW0EQSdrU6FEvEUXJujAIMFuSFBLWTsnDHw0B2rARxKNX6PqpaCj8ow6Bu15K3G_CGc40Rf5s4F46FlVQriuoP6SrX0--qY3ppaq9tk6e8DdzPoQyzAB4b904VOmC4pttpL_zT6ISgcGxuchL6DLQoSTxaJZDRCFhawifKoYwPn3d5BNLH80gH",
    tags: ["오메가-3", "저지방"],
  },
];

const DEFAULT_ANALYSIS_MAP: Record<string, NutritionAnalysis> = {
  "고기국수": {
    foodName: "고기국수",
    riskScoreDiabetes: 4.0,
    riskLabelDiabetes: "위험",
    riskScoreHypertension: 5.0,
    riskLabelHypertension: "매우 위험",
    riskScoreKidney: 3.5,
    riskLabelKidney: "주의",
    riskScoreAllergy: 1.5,
    riskLabelAllergy: "안전",
    riskScoreVegan: 5.0,
    riskLabelVegan: "매우 위험",
    aiRecommendation: "안전하게 먹는 방법:\n면은 절반만 드시고, 국물은 가급적 피하세요. 육수는 장시간 돼지 사골을 우려내어 나트륨과 포화지방 함량이 높습니다.",
    nutrition: {
      carbs: "78g (높음)",
      carbsProgress: 85,
      sodium: "2,300mg (위험)",
      sodiumProgress: 95,
      sugars: "4g (안전)",
      sugarsProgress: 15,
    },
    alternative: {
      name: "제주 돔베고기",
      description: "신선한 채소와 함께 드세요. 이 메뉴는 탄수화물과 나트륨 섭취를 크게 줄이면서 양질의 단백질을 섭취할 수 있게 해줍니다.",
    },
  },
  "제주 흑돼지": {
    foodName: "제주 흑돼지",
    riskScoreDiabetes: 1.5,
    riskLabelDiabetes: "안전",
    riskScoreHypertension: 2.0,
    riskLabelHypertension: "주의",
    riskScoreKidney: 2.5,
    riskLabelKidney: "주의",
    riskScoreAllergy: 1.0,
    riskLabelAllergy: "안전",
    riskScoreVegan: 5.0,
    riskLabelVegan: "매우 위험",
    aiRecommendation: "안전하게 먹는 방법:\n양념된 고기보다는 생구이를 고르시고, 신선한 상추와 깻잎 등 쌈채소를 고기보다 2배 많이 싸서 드세요. 나트륨을 흡수해 배출하는 데 큰 도움이 됩니다.",
    nutrition: {
      carbs: "2g (안전)",
      carbsProgress: 5,
      sodium: "350mg (안전)",
      sodiumProgress: 18,
      sugars: "0g (안전)",
      sugarsProgress: 0,
    },
    alternative: {
      name: "옥돔 구이",
      description: "생선 구이는 오메가-3 지방산이 풍부하여 혈액 순환 및 심혈관 보호에 매우 효과적인 대안입니다.",
    },
  },
  "전복죽": {
    foodName: "전복죽",
    riskScoreDiabetes: 2.5,
    riskLabelDiabetes: "주의",
    riskScoreHypertension: 1.8,
    riskLabelHypertension: "안전",
    riskScoreKidney: 3.0,
    riskLabelKidney: "주의",
    riskScoreAllergy: 4.5,
    riskLabelAllergy: "위험",
    riskScoreVegan: 4.0,
    riskLabelVegan: "위험",
    aiRecommendation: "안전하게 먹는 방법:\n전복죽은 비교적 당지수가 낮지만 쌀이 푹 퍼진 상태라 흡수가 빠릅니다. 식사 전 가벼운 반찬이나 오이/당근 등 채소를 먼저 한 입 드신 뒤 전복죽을 드시면 혈당이 천천히 오릅니다.",
    nutrition: {
      carbs: "45g (보통)",
      carbsProgress: 45,
      sodium: "580mg (보통)",
      sodiumProgress: 29,
      sugars: "2g (안전)",
      sugarsProgress: 5,
    },
    alternative: {
      name: "제주 메밀 범벅",
      description: "메밀은 당지수가 매우 낮고 이뇨 작용을 도와 신장과 혈당 관리에 탁월한 대체 웰니스 식사입니다.",
    },
  },
  "옥돔 구이": {
    foodName: "옥돔 구이",
    riskScoreDiabetes: 1.2,
    riskLabelDiabetes: "안전",
    riskScoreHypertension: 3.0,
    riskLabelHypertension: "주의",
    riskScoreKidney: 3.5,
    riskLabelKidney: "주의",
    riskScoreAllergy: 3.0,
    riskLabelAllergy: "주의",
    riskScoreVegan: 4.5,
    riskLabelVegan: "위험",
    aiRecommendation: "안전하게 먹는 방법:\n소금 간이 되어 있는 생선이므로 밥과 넉넉한 채소를 곁들이며, 레몬즙을 가득 뿌려 싱거운 맛을 보완해 드시면 나트륨 과잉 섭취를 막을 수 있습니다.",
    nutrition: {
      carbs: "1g (안전)",
      carbsProgress: 2,
      sodium: "890mg (주의)",
      sodiumProgress: 44,
      sugars: "0g (안전)",
      sugarsProgress: 0,
    },
    alternative: {
      name: "제주 돔베고기(수육)",
      description: "물에 삶아내어 염분을 뺀 수육은 나트륨 조절이 더 쉽고 안전한 대안입니다.",
    },
  },
};

export function getDefaultAnalysis(foodName: string): NutritionAnalysis {
  // Try exact match, otherwise try simple inclusion, else generate general template
  const matched = Object.keys(DEFAULT_ANALYSIS_MAP).find(
    (key) => key.includes(foodName) || foodName.includes(key)
  );
  if (matched) {
    return DEFAULT_ANALYSIS_MAP[matched];
  }

  // Generative default fallback
  return {
    foodName: foodName,
    riskScoreDiabetes: 3.0,
    riskLabelDiabetes: "주의",
    riskScoreHypertension: 3.0,
    riskLabelHypertension: "주의",
    riskScoreKidney: 2.5,
    riskLabelKidney: "안전",
    riskScoreAllergy: 1.0,
    riskLabelAllergy: "안전",
    riskScoreVegan: 3.0,
    riskLabelVegan: "주의",
    aiRecommendation: "안전하게 먹는 방법:\n이 음식은 염분과 단순당 조절이 필요할 수 있으니 양념을 적게 묻혀 드시고, 식후 가벼운 20분 산책을 권해 드립니다.",
    nutrition: {
      carbs: "35g (보통)",
      carbsProgress: 40,
      sodium: "800mg (주의)",
      sodiumProgress: 40,
      sugars: "6g (주의)",
      sugarsProgress: 20,
    },
    alternative: {
      name: "제주 돔베고기",
      description: "기름기와 나트륨이 빠진 삶은 고기는 거의 모든 만성 질환에 안심하고 권할 수 있는 훌륭한 고단백 웰니스 대안입니다.",
    },
  };
}
