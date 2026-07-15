import { getJejuEmergencyHospitals } from "../_lib/emergencyMedicalApi.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const hospitals = await getJejuEmergencyHospitals();
    res.status(200).json({ hospitals: hospitals ?? [] });
  } catch (error: any) {
    console.error("Emergency Hospitals Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch emergency hospitals." });
  }
}
