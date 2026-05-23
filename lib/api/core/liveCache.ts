let cache: any = null;
let lastFetch = 0;

const TTL = 15000; // 15s

export async function cached(fn: () => Promise<any>) {
  const now = Date.now();

  if (cache && now - lastFetch < TTL) {
    return cache;
  }

  cache = await fn();
  lastFetch = now;

  return cache;
}