import { ssrFetch } from "./core/ssrFetch";
import { API_BASE } from "./core/apiBase";

import { WordPressPostWithMedia } from "@/types/wordpress-media";
import { mapEspnMatches } from "@/lib/mappers/espnMatchMapper";

/**
 * =========================
 * POSTS (WORDPRESS)
 * =========================
 */

/**
 * Fetch latest posts
 */
export async function getPosts() {
  return ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?per_page=20&_embed=1`,
    {
      fallback: [],
    }
  );
}

/**
 * Fetch single post by slug
 */
export async function getPostBySlug(slug: string) {
  const data = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?slug=${slug}&_embed=1`,
    {
      fallback: [],
    }
  );

  return data?.[0] || null;
}

/**
 * Fetch all categories
 */
export async function getCategories() {
  return ssrFetch<any[]>(
    `${API_BASE}/categories?per_page=100`,
    {
      fallback: [],
    }
  );
}

/**
 * Fetch posts by category slug
 */
export async function getCategoryPosts(slug: string) {
  const categories = await ssrFetch<any[]>(
    `${API_BASE}/categories?slug=${slug}`,
    {
      fallback: [],
    }
  );

  const category = categories?.[0];

  if (!category?.id) {
    return [];
  }

  return ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?categories=${category.id}&per_page=20&_embed=1`,
    {
      fallback: [],
    }
  );
}

/**
 * =========================
 * LIVE SCORES (ESPN)
 * =========================
 */

/**
 * Fetch live Premier League scores
 * - No API key required
 * - Auto-refresh every 30 seconds
 * - Normalized into internal match format
 */
export async function getScores() {
  try {
    const res = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",
      {
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) {
      console.warn("ESPN API error:", res.status);
      return [];
    }

    const data = await res.json();

    const events = Array.isArray(data?.events)
      ? data.events
      : [];

    return mapEspnMatches(events);
  } catch (err) {
    console.error("ESPN fetch failed:", err);
    return [];
  }
}