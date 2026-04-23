const BASE_URL =
  "https://arsenaltalks.com/wp-json/wp/v2";

export async function getLatestPosts(
  page: number = 1,
  perPage: number = 10
) {
  const res = await fetch(
    `${BASE_URL}/posts?_embed&per_page=${perPage}&page=${page}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export async function getPostBySlug(slug: string) {
  const res = await fetch(
    `${BASE_URL}/posts?_embed&slug=${slug}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const data = await res.json();
  return data[0];
}

export async function getPostsByCategorySlug(
  slug: string
) {
  const catRes = await fetch(
    `${BASE_URL}/categories?slug=${slug}`,
    { next: { revalidate: 60 } }
  );

  if (!catRes.ok) {
    throw new Error("Failed category lookup");
  }

  const cats = await catRes.json();

  if (!cats.length) return [];

  const categoryId = cats[0].id;

  const postRes = await fetch(
    `${BASE_URL}/posts?_embed&categories=${categoryId}`,
    { next: { revalidate: 60 } }
  );

  if (!postRes.ok) {
    throw new Error("Failed category posts");
  }

  return postRes.json();
}

export function getFeaturedImage(post: any) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]
      ?.source_url || "/placeholder.jpg"
  );
}