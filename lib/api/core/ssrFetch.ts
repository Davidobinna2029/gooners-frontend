
import {
  fetchWithTimeout,
  FetchTimeoutError,
} from "./fetchWithTimeout";

export async function ssrFetch<T>(
  url: string,
  revalidate = 60
): Promise<T> {
  try {
    const res = await fetchWithTimeout(
      url,
      {
        next: { revalidate },
        headers: {
          Accept: "application/json",
        },
      },
      30000
    );

    if (!res.ok) {
      throw new Error(
        `[SSR FETCH ERROR] ${res.status}: ${url}`
      );
    }

    return (await res.json()) as T;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    console.error("[SSR FETCH ERROR]", {
      url,
      name:
        error instanceof Error
          ? error.name
          : "UnknownError",
      message,
      timedOut: error instanceof FetchTimeoutError,
    });

    throw error;
  }
}
