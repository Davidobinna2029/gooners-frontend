const BASE =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  "https://api.arsenaltalks.com";

const API = `${BASE}/wp-json/wp/v2/posts`;

let memoryCache: any = null;

async function fetchWithRetry(url: string, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const data = await res.json();
        memoryCache = data;
        return data;
      }
    } catch (err) {
      console.log("Retry:", i + 1);
    }
  }

  return memoryCache || [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "10";

  const data = await fetchWithRetry(
    `${API}?_embed&page=${page}&per_page=${perPage}`
  );

  return Response.json(data);
}