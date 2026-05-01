const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://arsenaltalks.com";

function fixImageUrl(url?: string): string {
  if (!url) return "/placeholder.jpg";
  return url.replace("http://", "https://");
}

// 🔥 ALWAYS use your internal API (NOT WordPress)
export async function getLatestPosts(perPage: number = 8) {
  try {
    const res = await fetch(
      `${SITE_URL}/api/posts?per_page=${perPage}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("API ERROR:", res.status);
      return [];
    }

    const posts = await res.json();

    return posts.map((post: any) => ({
      ...post,
      featured_image: fixImageUrl(
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
      ),
    }));
  } catch (error) {
    console.error("Latest posts error:", error);
    return [];
  }
}

export async function getPost(slug: string) {
  try {
    const res = await fetch(
      `${SITE_URL}/api/post/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const post = await res.json();

    if (!post) return null;

    return {
      ...post,
      featured_image: fixImageUrl(
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
      ),
    };
  } catch (error) {
    console.error("Single post error:", error);
    return null;
  }
}

export function getFeaturedImage(post: any): string {
  return fixImageUrl(
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url
  );
}