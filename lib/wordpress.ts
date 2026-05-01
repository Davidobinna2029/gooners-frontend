const isServer = typeof window === "undefined";

function getBaseUrl() {
  // Server (Vercel)
  if (isServer) {
    return process.env.NEXT_PUBLIC_SITE_URL || "https://arsenaltalks.com";
  }

  // Browser
  return "";
}

export async function getLatestPosts(page = 1, perPage = 10) {
  try {
    const base = getBaseUrl();

    const res = await fetch(
      `${base}/api/posts?page=${page}&per_page=${perPage}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("API ERROR:", res.status);
      return [];
    }

    return res.json();
  } catch (err) {
    console.error("FETCH ERROR:", err);
    return [];
  }
}

export async function getPost(slug: string) {
  try {
    const base = getBaseUrl();

    const res = await fetch(`${base}/api/post/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

export function getFeaturedImage(post: any) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?.jetpack_featured_media_url ||
    "/placeholder.jpg"
  );
}