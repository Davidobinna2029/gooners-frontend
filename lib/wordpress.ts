const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.arsenaltalks.com/wp-json/wp/v2";

export async function getPosts(page = 1) {
  try {
    const res = await fetch(
      `${API_URL}/posts?_embed&per_page=10&page=${page}`,
      {
        next: { revalidate: 60 },
      }
    );

    const data = await res.json();
    return formatPosts(data);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getFeaturedPosts() {
  try {
    const res = await fetch(`${API_URL}/posts?_embed&per_page=5`, {
      next: { revalidate: 60 },
    });

    const data = await res.json();
    return formatPosts(data);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/posts?_embed&slug=${slug}`, {
      next: { revalidate: 60 },
    });

    const data = await res.json();
    const posts = formatPosts(data);
    return posts[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories?per_page=20`, {
      next: { revalidate: 3600 },
    });

    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getCategoryPosts(slug: string) {
  try {
    const categories = await getCategories();
    const category = categories.find((cat: any) => cat.slug === slug);

    if (!category) return [];

    const res = await fetch(
      `${API_URL}/posts?_embed&categories=${category.id}&per_page=12`,
      {
        next: { revalidate: 60 },
      }
    );

    const data = await res.json();
    return formatPosts(data);
  } catch (error) {
    console.error(error);
    return [];
  }
}

function formatPosts(posts: any[]) {
  return posts.map((post: any) => ({
    ...post,
    featuredImage:
      post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "/fallback.jpg",
  }));
}

// Alias for convenience
export const getPostBySlug = getPost;