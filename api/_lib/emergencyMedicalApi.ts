// 국립중앙의료원 전국 응급의료기관 정보 조회 서비스 (공공데이터포털 데이터셋 15000563)
// data.go.kr은 계정당 서비스키 1개를 모든 승인된 API에 공용으로 사용하므로
// 식품영양DB와 동일한 FOOD_SAFETY_API_KEY 값을 재사용합니다.
// 참고문서(NIA-IFT-OpenAPI활용가이드-01.국립중앙의료원-응급의료정보조회서비스)로 검증된 필드 매핑.

const API_URL = "https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytListInfoInqire";

export interface EmergencyHospital {
  name: string;
  address: string;
  phone: string;
}

function parseXmlItems(xml: string): Record<string, string>[] {
  const items: Record<string, string>[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch: RegExpExecArray | null;
  while ((itemMatch = itemRegex.exec(xml))) {
    const fields: Record<string, string> = {};
    const fieldRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
    let fieldMatch: RegExpExecArray | null;
    while ((fieldMatch = fieldRegex.exec(itemMatch[1]))) {
      fields[fieldMatch[1]] = fieldMatch[2].trim();
    }
    items.push(fields);
  }
  return items;
}

export async function getJejuEmergencyHospitals(): Promise<EmergencyHospital[] | null> {
  const apiKey = process.env.FOOD_SAFETY_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    serviceKey: apiKey,
    Q0: "제주특별자치도",
    numOfRows: "20",
    pageNo: "1",
  });

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);
    const xmlText = await response.text();

    if (!response.ok) {
      console.error("E-Gen API HTTP error:", response.status, xmlText.slice(0, 500));
      return null;
    }

    const resultCode = xmlText.match(/<resultCode>(.*?)<\/resultCode>/)?.[1];
    if (resultCode && resultCode !== "00") {
      console.error("E-Gen API result error:", resultCode, xmlText.slice(0, 500));
      return null;
    }

    const items = parseXmlItems(xmlText);

    const hospitals = items
      .map((item) => ({
        name: item.dutyName ?? "",
        address: item.dutyAddr ?? "",
        phone: item.dutyTel1 || item.dutyTel3 || "",
      }))
      .filter((h) => h.name);

    return hospitals.length > 0 ? hospitals : null;
  } catch (error) {
    console.error("E-Gen API error:", error);
    return null;
  }
}
