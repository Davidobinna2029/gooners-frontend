import { ssrFetch } from "./core/ssrFetch";
import { API_BASE } from "./core/apiBase";

import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import { mapEspnMatches } from "@/lib/mappers/espnMatchMapper";

/**
 * =========================
 * SAFE FETCH WRAPPER
 * =========================
 */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("SAFE FETCH FAILED:", err);
    return fallback;
  }
}

/**
 * FORCE EMBED PARAM (CRITICAL FOR FEATURED IMAGES)
 */
const WP_EMBED = "_embed=1";

/**
 * =========================
 * POSTS
 * =========================
 */

export async function getPosts() {
  return safe(async () => {
    return ssrFetch<WordPressPostWithMedia[]>(
      `${API_BASE}/posts?per_page=20&${WP_EMBED}`,
      { fallback: [] }
    );
  }, []);
}

export async function getPostBySlug(slug: string) {
  return safe(async () => {
    const data = await ssrFetch<WordPressPostWithMedia[]>(
      `${API_BASE}/posts?slug=${slug}&${WP_EMBED}`,
      { fallback: [] }
    );

    return data?.[0] ?? null;
  }, null);
}

export async function getCategories() {
  return safe(async () => {
    return ssrFetch<any[]>(
      `${API_BASE}/categories?per_page=100`,
      { fallback: [] }
    );
  }, []);
}

export async function getCategoryPosts(slug: string) {
  return safe(async () => {
    const categories = await ssrFetch<any[]>(
      `${API_BASE}/categories?slug=${slug}`,
      { fallback: [] }
    );

    const categoryId = categories?.[0]?.id;

    if (!categoryId) return [];

    return ssrFetch<WordPressPostWithMedia[]>(
      `${API_BASE}/posts?categories=${categoryId}&per_page=20&${WP_EMBED}`,
      { fallback: [] }
    );
  }, []);
}

/**
 * =========================
 * LIVE SCORES
 * =========================
 */

export async function getScores() {
  return safe(async () => {
    const res = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",
      { next: { revalidate: 30 } }
    );

    if (!res.ok) return [];

    const data = await res.json();

    const events = Array.isArray(data?.events) ? data.events : [];

    return mapEspnMatches(events);
  }, []);
}