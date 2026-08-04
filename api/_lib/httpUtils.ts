// 외부 공공데이터/관광공사 API가 응답을 멈췄을 때 요청이 무한정 걸려있지 않도록
// 일정 시간 후 자동으로 중단시키는 fetch 래퍼.

export async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
