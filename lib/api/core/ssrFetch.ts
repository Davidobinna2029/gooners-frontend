import { fetchWithTimeout } from "./fetchWithTimeout";

export async function ssrFetch<T>(
  url: string,
  revalidate = 60
): Promise<T> {
  const res = await fetchWithTimeout(
    url,
    {
      next: {
        revalidate,
      },

      headers: {
        Accept: "application/json",
      },
    },
    8000
  );

  if (!res.ok) {
    throw new Error(
      `[SSR FETCH ERROR] ${res.status} ${res.statusText}: ${url}`
    );
  }

  const data = await res.json();

  return data as T;
}