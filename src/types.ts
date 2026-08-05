export interface HealthCondition {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  intensity: string;
  imageUrl: string;
  tag: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  rating: number;
  imageUrl: string;
  tags: string[];
}

export interface NutritionAnalysis {
  foodName: string;
  isOfficialData: boolean;
  isVenueNameGuess: boolean;
  riskScoreDiabetes: number;
  riskLabelDiabetes: string;
  riskScoreHypertension: number;
  riskLabelHypertension: string;
  riskScoreKidney: number;
  riskLabelKidney: string;
  aiRecommendation: string;
  nutrition: {
    carbs: string;
    carbsProgress: number;
    sodium: string;
    sodiumProgress: number;
    sugars: string;
    sugarsProgress: number;
  };
  alternative: {
    name: string;
    description: string;
  };
}

export interface FoodVenueInfo {
  imageUrl?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  tel?: string | null;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}
