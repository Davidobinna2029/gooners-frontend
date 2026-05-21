// lib/api/wordpress.ts

const apiUrl =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.arsenaltalks.com/wp-json/wp/v2";

/**
 * Safe fetch wrapper
 * - Prevents HTML responses breaking JSON parsing
 * - Adds timeout protection
 * - Supports Next.js ISR caching
 */
async function safeFetch(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 60 }, // ISR caching (1 min)
    });

    clearTimeout(timeout);

    const contentType = res.headers.get("content-type") || "";

    // ❌ Block non-JSON responses (HTML, redirects, errors)
    if (!contentType.includes("application/json")) {
      const text = await res.text();

      console.error("❌ NON-JSON RESPONSE:", url);
      console.error(text.slice(0, 200));

      return null;
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeout);

    console.error("❌ FETCH FAILED:", url, err);

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
 * Fetch posts by category slug (2-step WordPress method)
 * 1. Get category ID
 * 2. Fetch posts using ID
 */
export async function getCategoryPosts(slug: string) {
  const categories = await safeFetch(
    `${apiUrl}/categories?slug=${slug}`
  );

  const category = Array.isArray(categories) ? categories[0] : null;

  if (!category?.id) {
    console.warn("⚠️ Category not found:", slug);
    return [];
  }

  const posts = await safeFetch(
    `${apiUrl}/posts?categories=${category.id}&per_page=100&_embed=1`
  );

  return Array.isArray(posts) ? posts : [];
}

/**
 * Optional: scores endpoint (ONLY works if WP custom route exists)
 */
export async function getScores() {
  const data = await safeFetch(`${apiUrl}/scores`);

  return Array.isArray(data) ? data : [];
}