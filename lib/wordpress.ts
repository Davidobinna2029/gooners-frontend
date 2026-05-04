const SITE_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://arsenaltalks.com";

const API_BASE = `${SITE_URL}/wp-json/wp/v2`;

function fixImage(url?: string) {
  if (!url) return "/placeholder.jpg";
  return url.replace("http://", "https://");
}

// 🔥 bulletproof fetch
async function safeFetch(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
      next: { revalidate: 120 },
    });

    if (!res.ok) throw new Error("WP blocked");

    return await res.json();
  } catch (err) {
    console.error("WordPress fetch failed:", err);
    return [];
  }
}

export async function getLatestPosts(limit = 8) {
  const data = await safeFetch(
    `${API_BASE}/posts?_embed&per_page=${limit}`
  );

  return data.map((post: any) => ({
    ...post,
    featured_image: fixImage(
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
    ),
  }));
}

export async function getPost(slug: string) {
  const data = await safeFetch(
    `${API_BASE}/posts?slug=${slug}&_embed`
  );

  const post = data?.[0];
  if (!post) return null;

  return {
    ...post,
    featured_image: fixImage(
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
    ),
  };
}