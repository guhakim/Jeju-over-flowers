import { getJejuAirQuality, getJejuUvIndex } from "../_lib/weatherApi.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const [airQuality, uvIndex] = await Promise.all([getJejuAirQuality(), getJejuUvIndex()]);
    res.status(200).json({ airQuality, uvIndex });
  } catch (error: any) {
    console.error("Environment Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch environmental data." });
  }
}
