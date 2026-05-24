const cache = new Map<string, any>();

export async function cachedFetch<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  if (cache.has(key)) return cache.get(key);

  const data = await fn();
  cache.set(key, data);

  return data;
}