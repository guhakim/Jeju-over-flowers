import { getJejuBarrierFreeSpots } from "../_lib/jejuDataHub.js";
import { rejectIfRateLimited } from "../_lib/rateLimit.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (rejectIfRateLimited(req, res, "tourism-barrier-free", 30)) return;

  try {
    const spots = await getJejuBarrierFreeSpots();
    res.status(200).json({ spots: spots ?? [] });
  } catch (error: any) {
    console.error("Barrier-Free Spots Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch barrier-free spots." });
  }
}
