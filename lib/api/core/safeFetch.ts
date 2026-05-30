export async function safeFetch<T>(
  url: string,
  retries = 3
): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        next: {
          revalidate: 30,
        },
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(
          `HTTP ${res.status}: ${res.statusText}`
        );
      }

      const data = await res.json();

      return data as T;
    } catch (error) {
      console.warn(
        `[SAFE FETCH RETRY ${attempt}/${retries}]`,
        url
      );

      if (attempt === retries) {
        console.error(
          "[SAFE FETCH FAILED]",
          url,
          error
        );

        return null;
      }
    }
  }

  return null;
}