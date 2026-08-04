// IP당 분당 요청 수를 제한하는 인메모리 슬라이딩 윈도우 리미터.
// Vercel 서버리스 콜드스타트마다 초기화되지만, 로컬 Express 서버와 웜 인스턴스에서는
// 단일 클라이언트의 반복 호출로 인한 외부 API 쿼터 소모·Gemini 비용 폭주를 막아준다.

const WINDOW_MS = 60_000;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, limit: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

export function getClientIp(req: any): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || "unknown";
}

export function rejectIfRateLimited(req: any, res: any, routeKey: string, limit: number): boolean {
  const ip = getClientIp(req);
  if (isRateLimited(`${routeKey}:${ip}`, limit)) {
    res.status(429).json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." });
    return true;
  }
  return false;
}
