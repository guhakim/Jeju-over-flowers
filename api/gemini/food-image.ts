import { generateFoodImage } from "../_lib/foodImageApi.js";
import { rejectIfRateLimited } from "../_lib/rateLimit.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (rejectIfRateLimited(req, res, "gemini-food-image", 15)) return;

  try {
    const { foodName } = req.body;
    if (!foodName) {
      return res.status(400).json({ error: "Food name is required" });
    }

    const imageUrl = await generateFoodImage(foodName);
    res.status(200).json({ imageUrl });
  } catch (error: any) {
    console.error("Food Image Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate food image." });
  }
}
