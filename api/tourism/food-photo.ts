import { searchJejuFoodPhoto } from "../_lib/restaurantTourApi.js";
import { rejectIfRateLimited } from "../_lib/rateLimit.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (rejectIfRateLimited(req, res, "tourism-food-photo", 30)) return;

  const foodName = typeof req.query?.foodName === "string" ? req.query.foodName : "";
  if (!foodName) {
    return res.status(400).json({ error: "foodName query parameter is required" });
  }

  try {
    const photo = await searchJejuFoodPhoto(foodName);
    res.status(200).json({ photo });
  } catch (error: any) {
    console.error("Food Photo Search Error:", error);
    res.status(500).json({ error: error.message || "Failed to search food photo." });
  }
}
