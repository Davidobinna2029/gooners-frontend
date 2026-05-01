const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

export async function getLatestPosts(page = 1, perPage = 10) {
  try {
    const res = await fetch(
      `${SITE}/api/posts?page=${page}&per_page=${perPage}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return [];

    return await res.json();
  } catch {
    return [];
  }
}

export async function getPost(slug: string) {
  try {
    const res = await fetch(
      `${SITE}/api/post/${slug}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return null;

    return await res.json();
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