type Options = {
  fallback?: any;
  revalidate?: number;
};

export async function ssrFetch<T>(
  url: string,
  options: Options = {}
): Promise<T> {
  const { fallback = null, revalidate = 60 } = options;

  try {
    const res = await fetch(url, {
      next: { revalidate },
    });

    if (!res.ok) {
      console.error("SSR FETCH FAILED:", url, res.status);
      return fallback;
    }

    const contentType =
      res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error("NON-JSON RESPONSE:", url);
      console.error(text.slice(0, 200));
      return fallback;
    }

    return await res.json();
  } catch (err) {
    console.error("SSR FETCH FAILED:", url, err);
    return fallback;
  }
}