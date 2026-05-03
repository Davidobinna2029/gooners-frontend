// lib/fallbackStore.ts

type CacheEntry<T> = {
  data: T;
  ts: number;
};

const memory = new Map<string, CacheEntry<any>>();
const TTL = 5 * 60 * 1000; // 5 mins

export function getCache<T>(key: string): T | null {
  const entry = memory.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL) return null;
  return entry.data;
}

export function setCache<T>(key: string, data: T) {
  memory.set(key, { data, ts: Date.now() });
}