import { fetchWithTimeout } from "./fetchWithTimeout";

export async function ssrFetch<T>(
  url: string,
  options: {
    fallback: T;
    revalidate?: number;
  }
): Promise<T> {
  try {
    const res = await fetchWithTimeout(
      url,
      {
        next: {
          revalidate: options.revalidate ?? 60,
        },

        headers: {
          Accept: "application/json",
        },
      },
      8000
    );

    if (!res.ok) {
      console.error(
        `[SSR FETCH ERROR] ${res.status} ${res.statusText}: ${url}`
      );

      return options.fallback;
    }

    const data = await res.json();

    return data ?? options.fallback;
  } catch (error) {
    console.error(
      `[SSR FETCH FAILED]: ${url}`,
      error
    );

    return options.fallback;
  }
}