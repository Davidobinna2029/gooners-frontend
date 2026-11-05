
import { API_BASE } from "./core/apiBase";
import { ssrFetch } from "./core/ssrFetch";
import type { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * WordPress embed flag
 */
const WP_EMBED = "_embed";

/**
 * Default post count
 */
const DEFAULT_POST_LIMIT = 20;

/**
 * =========================
 * GET POSTS
 * =========================
 */
export async function getPosts(
  limit = DEFAULT_POST_LIMIT
): Promise<WordPressPostWithMedia[]> {
  const posts = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?per_page=${limit}&${WP_EMBED}`
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
    `${API_BASE}/posts?slug=${encodeURIComponent(slug)}&${WP_EMBED}`
  );

  return Array.isArray(posts) ? posts[0] ?? null : null;
}

/**
 * =========================
 * STICKY POSTS
 * =========================
 */
export async function getStickyPosts(): Promise<WordPressPostWithMedia[]> {
  const posts = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?sticky=true&${WP_EMBED}`
  );

  return Array.isArray(posts) ? posts : [];
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
 * CATEGORY FEED
 * Returns the category ID and its posts.
 * Used by category pages with infinite scrolling.
 * =========================
 */
export async function getCategoryFeed(
  slug: string,
  limit = DEFAULT_POST_LIMIT
): Promise<{
  categoryId: number | null;
  posts: WordPressPostWithMedia[];
}> {
  const categories = await ssrFetch<any[]>(
    `${API_BASE}/categories?slug=${encodeURIComponent(slug)}`
  );

  const rawCategoryId = categories?.[0]?.id;
  const categoryId = Number(rawCategoryId);

  if (!Number.isFinite(categoryId) || categoryId <= 0) {
    return {
      categoryId: null,
      posts: [],
    };
  }

  const posts = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?categories=${categoryId}&per_page=${limit}&${WP_EMBED}`
  );

  return {
    categoryId,
    posts: Array.isArray(posts) ? posts : [],
  };
}

/**
 * =========================
 * CATEGORY POSTS
 * Backward-compatible helper.
 * =========================
 */
export async function getCategoryPosts(
  slug: string,
  limit = DEFAULT_POST_LIMIT
): Promise<WordPressPostWithMedia[]> {
  const { posts } = await getCategoryFeed(slug, limit);

  return posts;
}

/**
 * =========================
 * RECENTLY MODIFIED POSTS
 * =========================
 */
export async function getRecentlyModifiedPosts(
  limit = 20
): Promise<WordPressPostWithMedia[]> {
  const posts = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?orderby=modified&order=desc&per_page=${limit}&${WP_EMBED}`
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
      next: {
        revalidate: 30,
      },
    }
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();

  return Array.isArray(data?.events) ? data.events : [];
}
