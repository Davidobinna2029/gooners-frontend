import { ssrFetch } from "./core/ssrFetch";
import { API_BASE } from "./core/apiBase";

import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import { mapEspnMatches } from "@/lib/mappers/espnMatchMapper";

/**
 * =========================
 * SAFE FETCH CORE
 * =========================
 * Centralized fallback system (no nested wrappers)
 */
async function safeFetch<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("API ERROR:", err);
    return fallback;
  }
}

/**
 * =========================
 * WORDPRESS CONFIG
 * =========================
 */
const WP_EMBED = "_embed=1";
const POSTS_LIMIT = 20;
const CATEGORY_LIMIT = 100;

/**
 * =========================
 * POSTS (CORE FEED SOURCE)
 * =========================
 */
export async function getPosts(): Promise<WordPressPostWithMedia[]> {
  return safeFetch(async () => {
    return ssrFetch<WordPressPostWithMedia[]>(
      `${API_BASE}/posts?per_page=${POSTS_LIMIT}&${WP_EMBED}`,
      { fallback: [] }
    );
  }, []);
}

/**
 * SINGLE POST BY SLUG
 */
export async function getPostBySlug(
  slug: string
): Promise<WordPressPostWithMedia | null> {
  return safeFetch(async () => {
    const data = await ssrFetch<WordPressPostWithMedia[]>(
      `${API_BASE}/posts?slug=${slug}&${WP_EMBED}`,
      { fallback: [] }
    );

    return data?.[0] ?? null;
  }, null);
}

/**
 * =========================
 * CATEGORIES
 * =========================
 */
export async function getCategories(): Promise<any[]> {
  return safeFetch(async () => {
    return ssrFetch<any[]>(
      `${API_BASE}/categories?per_page=${CATEGORY_LIMIT}`,
      { fallback: [] }
    );
  }, []);
}

/**
 * CATEGORY FILTERED POSTS
 */
export async function getCategoryPosts(
  slug: string
): Promise<WordPressPostWithMedia[]> {
  return safeFetch(async () => {
    const categories = await ssrFetch<any[]>(
      `${API_BASE}/categories?slug=${slug}`,
      { fallback: [] }
    );

    const categoryId = categories?.[0]?.id;
    if (!categoryId) return [];

    return ssrFetch<WordPressPostWithMedia[]>(
      `${API_BASE}/posts?categories=${categoryId}&per_page=${POSTS_LIMIT}&${WP_EMBED}`,
      { fallback: [] }
    );
  }, []);
}

/**
 * =========================
 * LIVE SCORES (ESPN LAYER)
 * =========================
 */
export async function getScores() {
  return safeFetch(async () => {
    const res = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",
      {
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    const events = Array.isArray(data?.events) ? data.events : [];

    return mapEspnMatches(events);
  }, []);
}