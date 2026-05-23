// lib/api/core/fetcher.ts

type FetchOptions = {
  revalidate?: number;
  fallback?: any;
};

export async function fetchSafe<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate = 60, fallback = null } = options;

  try {
    const res = await fetch(url, {
      next: { revalidate },
    });

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      console.error("❌ HTTP ERROR:", res.status, url);
      return fallback;
    }

    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error("❌ NON-JSON RESPONSE:", url);
      console.error(text.slice(0, 200));
      return fallback;
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error("❌ FETCH FAILED:", url, err);
    return fallback;
  }
}