type Options = {
  revalidate?: number;
  fallback?: any;
};

export async function httpGet<T>(
  url: string,
  options: Options = {}
): Promise<T> {
  const { revalidate = 60, fallback = null } = options;

  try {
    const res = await fetch(url, {
      next: { revalidate },
    });

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok || !contentType.includes("application/json")) {
      return fallback;
    }

    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}