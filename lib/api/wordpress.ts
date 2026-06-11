import { API_BASE } from "./core/apiBase";
import { ssrFetch } from "./core/ssrFetch";
import type { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * IMPORTANT:
 * Use standard WordPress embed flag.
 * "_embed=1" is unreliable across WP setups.
 */
const WP_EMBED = "_embed";

/**
 * =========================
 * GET POSTS
 * =========================
 */
export async function getPosts(): Promise<WordPressPostWithMedia[]> {
  const posts = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?per_page=20&${WP_EMBED}`
  );

  return Array.isArray(posts) ? posts : [];
}

/**
 * =========================
 * SINGLE POST
 * =========================
 */
export async function getPostBySlug(
  slug: string
): Promise<WordPressPostWithMedia | null> {
  const posts = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?slug=${slug}&${WP_EMBED}`
  );

  return Array.isArray(posts) ? posts[0] ?? null : null;
}

/**
 * =========================
 * CATEGORIES
 * =========================
 */
export async function getCategories(): Promise<any[]> {
  const data = await ssrFetch<any[]>(
    `${API_BASE}/categories?per_page=100`
  );

  return Array.isArray(data) ? data : [];
}

/**
 * =========================
 * CATEGORY POSTS
 * =========================
 */
export async function getCategoryPosts(
  slug: string
): Promise<WordPressPostWithMedia[]> {
  const categories = await ssrFetch<any[]>(
    `${API_BASE}/categories?slug=${slug}`
  );

  const categoryId = categories?.[0]?.id;

  if (!categoryId) return [];

  const posts = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?categories=${categoryId}&per_page=20&${WP_EMBED}`
  );

  return Array.isArray(posts) ? posts : [];
}

/**
 * =========================
 * LIVE SCORES (ESPN)
 * =========================
 */
export async function getScores() {
  const res = await fetch(
    "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",
    {
      next: { revalidate: 30 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();

  return Array.isArray(data?.events) ? data.events : [];
}