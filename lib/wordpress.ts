const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://arsenaltalks.com/wp-json/wp/v2";

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: any;
  [key: string]: any;
}

interface WPCategory {
  id: number;
  slug: string;
  name: string;
}

function getFeaturedImage(post: WPPost): string | null {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  if (media?.source_url && media.source_url.startsWith("http")) {
    return media.source_url;
  }
  return null;
}

function formatPost(post: WPPost) {
  return {
    ...post,
    featuredImage: getFeaturedImage(post),
  };
}

async function safeFetch<T>(url: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export async function getPosts(page = 1) {
  const posts = await safeFetch<WPPost[]>(
    `${API_URL}/posts?_embed&per_page=10&page=${page}`,
    60
  );
  return posts ? posts.map(formatPost) : [];
}

export async function getFeaturedPosts() {
  const posts = await safeFetch<WPPost[]>(
    `${API_URL}/posts?_embed&per_page=5`,
    60
  );
  return posts ? posts.map(formatPost) : [];
}

export async function getPost(slug: string) {
  const posts = await safeFetch<WPPost[]>(
    `${API_URL}/posts?_embed&slug=${slug}`,
    60
  );
  return posts && posts.length > 0 ? formatPost(posts[0]) : null;
}

export async function getCategories() {
  return (
    (await safeFetch<WPCategory[]>(
      `${API_URL}/categories?per_page=20`,
      3600
    )) || []
  );
}

export async function getCategoryPosts(slug: string) {
  const categories = await getCategories();
  const category = categories.find((cat) => cat.slug === slug);
  if (!category) return [];

  const posts = await safeFetch<WPPost[]>(
    `${API_URL}/posts?_embed&categories=${category.id}`,
    60
  );
  return posts ? posts.map(formatPost) : [];
}
