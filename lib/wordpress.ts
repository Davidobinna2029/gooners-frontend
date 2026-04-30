const BASE =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  "https://api.arsenaltalks.com";

const API = `${BASE}/wp-json/wp/v2`;

/* ===================================
   TIMEOUT SAFE FETCH
=================================== */
async function safeFetch(url: string, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 8000); // 8s max

      const res = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: 60 }, // ISR caching
      });

      clearTimeout(timeout);

      if (res.ok) return await res.json();
    } catch (err) {
      console.log(`Fetch failed attempt ${i + 1}`, err);
    }
  }

  return null;
}

/* ===================================
   NORMALISE POSTS (SAFE OUTPUT)
=================================== */
function normalize(posts: any[]) {
  if (!Array.isArray(posts)) return [];

  return posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title?.rendered || "Untitled",
    date: p.date || null,
    excerpt: p.excerpt?.rendered || "",
    image:
      p?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      p.jetpack_featured_media_url ||
      "/placeholder.jpg",
  }));
}

/* ===================================
   GET LATEST POSTS (BULLETPROOF)
=================================== */
export async function getLatestPosts(page = 1, perPage = 10) {
  const data = await safeFetch(
    `${API}/posts?_embed&page=${page}&per_page=${perPage}`
  );

  if (!data) return []; // NEVER crash UI

  return normalize(data);
}

/* ===================================
   GET SINGLE POST (SAFE SLUG FETCH)
=================================== */
export async function getPost(slug: string) {
  const data = await safeFetch(
    `${API}/posts?slug=${slug}&_embed`
  );

  if (!data || !Array.isArray(data)) return null;

  return data[0] || null;
}

/* ===================================
   FEATURED IMAGE (MULTI-FALLBACK SYSTEM)
=================================== */
export function getFeaturedImage(post: any) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?.jetpack_featured_media_url ||
    post?.yoast_head_json?.og_image?.[0]?.url ||
    "/placeholder.jpg"
  );
}