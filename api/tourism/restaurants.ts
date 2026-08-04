import { getJejuRestaurants } from "../_lib/restaurantTourApi.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const spots = await getJejuRestaurants();
    res.status(200).json({ spots: spots ?? [] });
  } catch (error: any) {
    console.error("Restaurant Spots Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch restaurant spots." });
  }
}
