import { fetchWithTimeout } from "./fetchWithTimeout";

export async function ssrFetch<T>(
  url: string,
  options: { fallback: T; revalidate?: number }
): Promise<T> {
  try {
    const res = await fetchWithTimeout(
      url,
      {
        next: {
          revalidate: options.revalidate ?? 60,
        },
      },
      8000 // 🔥 reduce timeout for build safety
    );

    if (!res.ok) return options.fallback;

    return await res.json();
  } catch (err) {
    console.warn("SSR SAFE FALLBACK:", url);
    return options.fallback;
  }
}