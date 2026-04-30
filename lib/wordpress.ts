const SITE_URL = "https://api.arsenaltalks.com";
const API = `${SITE_URL}/wp-json/wp/v2`;

/* ===================================
   SAFE FETCH (NO CRASHES)
=================================== */
async function wpFetch(endpoint: string) {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.log("WP ERROR:", res.status);

      return {
        data: [],
        totalPages: 1,
      };
    }

    const data = await res.json();

    const totalPages =
      Number(res.headers.get("X-WP-TotalPages")) || 1;

    return {
      data,
      totalPages,
    };
  } catch (error) {
    console.log("FETCH FAILED:", error);

    return {
      data: [],
      totalPages: 1,
    };
  }
}

/* ===================================
   GET POSTS (WITH PAGINATION)
=================================== */
export async function getLatestPosts(
  page = 1,
  perPage = 10
) {
  return await wpFetch(
    `/posts?_embed&page=${page}&per_page=${perPage}`
  );
}

/* ===================================
   GET SINGLE POST (FIXED SLUG)
=================================== */
export async function getPost(slug: string) {
  try {
    const res = await fetch(
      `${API}/posts?slug=${slug}&_embed`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.log("POST ERROR:", res.status);
      return null;
    }

    const data = await res.json();

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.log("POST FETCH FAILED:", error);
    return null;
  }
}

/* ===================================
   FEATURED IMAGE (ROBUST)
=================================== */
export function getFeaturedImage(post: any) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?.jetpack_featured_media_url ||
    post?.yoast_head_json?.og_image?.[0]?.url ||
    "/placeholder.jpg"
  );
}