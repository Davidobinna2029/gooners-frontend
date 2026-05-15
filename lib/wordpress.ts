const API_URL =
  "https://arsenaltalks.com/wp-json/wp/v2";

export async function getPosts(page = 1) {
  const res = await fetch(
    `${API_URL}/posts?_embed&per_page=10&page=${page}`,
    {
      next: { revalidate: 60 },
    }
  );

  return await res.json();
}

export async function getFeaturedPosts() {
  const res = await fetch(
    `${API_URL}/posts?_embed&per_page=5`,
    {
      next: { revalidate: 60 },
    }
  );

  return await res.json();
}

export async function getCategories() {
  const res = await fetch(
    `${API_URL}/categories?per_page=20`,
    {
      next: { revalidate: 3600 },
    }
  );

  return await res.json();
}

export async function getCategoryPosts(
  slug: string
) {
  const catRes = await fetch(
    `${API_URL}/categories?slug=${slug}`
  );

  const categories = await catRes.json();

  if (!categories.length) {
    return [];
  }

  const categoryId = categories[0].id;

  const postRes = await fetch(
    `${API_URL}/posts?_embed&categories=${categoryId}&per_page=20`,
    {
      next: { revalidate: 60 },
    }
  );

  return await postRes.json();
}

export async function getPostBySlug(
  slug: string
) {
  const res = await fetch(
    `${API_URL}/posts?_embed&slug=${slug}`,
    {
      next: { revalidate: 60 },
    }
  );

  const posts = await res.json();

  return posts[0];
}

export function getFeaturedImage(
  post: any
) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]
      ?.source_url || "/fallback.jpg"
  );
}