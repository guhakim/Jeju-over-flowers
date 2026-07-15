// 제주데이터허브 "무장애 여행지 정보(통합)" (데이터 ID 858, 제주특별자치도 제공, 기준일 2021-09-30)
// https://www.jejudatahub.net/data/view/data/858 — 별도 인증키 없이 공개 조회 가능.

const DATASET_API_URL = "https://www.jejudatahub.net/api/data/view?id=858";

export interface BarrierFreeSpot {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export async function getJejuBarrierFreeSpots(): Promise<BarrierFreeSpot[] | null> {
  try {
    const response = await fetch(DATASET_API_URL);
    if (!response.ok) {
      console.error("JejuDataHub API HTTP error:", response.status);
      return null;
    }

    const data: any = await response.json();
    const rows: string[][] = data?.csvData;
    if (!Array.isArray(rows) || rows.length < 2) return null;

    const spots = rows
      .slice(1)
      .map((row) => {
        const [nameRaw, address, latStr, lngStr] = row;
        return {
          name: (nameRaw ?? "").replace(/^﻿/, "").trim(),
          address: address ?? "",
          lat: parseFloat(latStr),
          lng: parseFloat(lngStr),
        };
      })
      .filter((s) => s.name && Number.isFinite(s.lat) && Number.isFinite(s.lng));

    return spots.length > 0 ? spots : null;
  } catch (error) {
    console.error("JejuDataHub API error:", error);
    return null;
  }
}
