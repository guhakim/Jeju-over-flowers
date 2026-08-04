import { getJejuWellnessSpots } from "../_lib/wellnessTourApi.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const spots = await getJejuWellnessSpots();
    res.status(200).json({ spots: spots ?? [] });
  } catch (error: any) {
    console.error("Wellness Spots Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch wellness spots." });
  }
}
