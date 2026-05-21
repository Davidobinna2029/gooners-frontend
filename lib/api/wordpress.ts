// lib/api/wordpress.ts

const apiUrl =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.arsenaltalks.com/wp-json/wp/v2";

/**
 * Safe fetch wrapper (timeout + error handling + ISR support)
 */
async function safeFetch(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 60 }, // ISR caching (Next.js App Router)
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error("WordPress API error:", res.status, url);
      return null;
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeout);
    console.error("WordPress fetch failed:", err);
    return null;
  }
}

/**
 * Fetch all posts (latest first)
 */
export async function getPosts() {
  const data = await safeFetch(
    `${apiUrl}/posts?per_page=100&orderby=date&order=desc&_embed=1`
  );

  return Array.isArray(data) ? data : [];
}

/**
 * Fetch single post by slug
 */
export async function getPostBySlug(slug: string) {
  const data = await safeFetch(
    `${apiUrl}/posts?slug=${slug}&_embed=1`
  );

  return Array.isArray(data) ? data[0] || null : null;
}

/**
 * Fetch all categories
 */
export async function getCategories() {
  const data = await safeFetch(
    `${apiUrl}/categories?per_page=100`
  );

  return Array.isArray(data) ? data : [];
}

/**
 * Fetch posts by category SLUG (robust 2-step WordPress method)
 * Step 1: get category ID from slug
 * Step 2: fetch posts using category ID
 */
export async function getCategoryPosts(slug: string) {
  const categories = await safeFetch(
    `${apiUrl}/categories?slug=${slug}`
  );

  const category = Array.isArray(categories) ? categories[0] : null;

  if (!category?.id) {
    console.warn("Category not found for slug:", slug);
    return [];
  }

  const posts = await safeFetch(
    `${apiUrl}/posts?categories=${category.id}&per_page=100&_embed=1`
  );

  return Array.isArray(posts) ? posts : [];
}

/**
 * Optional: scores endpoint (only works if custom WP route exists)
 */
export async function getScores() {
  const data = await safeFetch(`${apiUrl}/scores`);

  return Array.isArray(data) ? data : [];
}