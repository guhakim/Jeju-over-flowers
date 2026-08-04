// 외부 공공데이터/관광공사 API 응답을 짧게 메모리 캐싱한다.
// 서버리스 콜드스타트마다 초기화되지만, 로컬 Express 서버와 웜 인스턴스에서는
// 매 페이지 로드마다 반복되는 외부 API 호출(및 일일 쿼터 소모)을 크게 줄여준다.

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { successTtlMs: number; failureTtlMs?: number }
): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    return hit.value as T;
  }

  const value = await fetcher();
  const isFailure = value === null || value === undefined;
  const ttl = isFailure ? options.failureTtlMs ?? 30_000 : options.successTtlMs;
  store.set(key, { value, expiresAt: Date.now() + ttl });
  return value;
}
