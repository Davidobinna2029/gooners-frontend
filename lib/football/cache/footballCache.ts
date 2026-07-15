// lib/football/cache/footballCache.ts

type CacheEntry<T> = {
  value: T;
  expires: number;
};

const cache = new Map<string, CacheEntry<any>>();

export async function remember<T>(
  key: string,
  ttl: number,
  callback: () => Promise<T>
): Promise<T> {
  const now = Date.now();

  const existing = cache.get(key);

  if (
    existing &&
    existing.expires > now
  ) {
    return existing.value;
  }

  const value =
    await callback();

  cache.set(key, {
    value,
    expires: now + ttl,
  });

  return value;
}