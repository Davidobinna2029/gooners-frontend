// lib/football/cache.ts

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

const DEFAULT_TTL =
  Number(process.env.FOOTBALL_CACHE_SECONDS ?? 60) * 1000;


export async function footballCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = DEFAULT_TTL
): Promise<T> {
  const cached =
    memoryCache.get(key);

  const now =
    Date.now();

  if (
    cached &&
    cached.expiresAt > now
  ) {
    return cached.data;
  }

  const data =
    await fetcher();

  memoryCache.set(
    key,
    {
      data,
      expiresAt:
        now + ttl,
    }
  );

  return data;
}


export function clearFootballCache(
  key?: string
) {
  if (key) {
    memoryCache.delete(key);
    return;
  }

  memoryCache.clear();
}