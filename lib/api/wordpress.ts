import { ssrFetch } from "./core/ssrFetch";
import { API_BASE } from "./core/apiBase";

import { WordPressPostWithMedia } from "@/types/wordpress-media";
import { mapEspnMatches } from "@/lib/mappers/espnMatchMapper";

/**
 * =========================
 * SAFE WRAPPER (GLOBAL)
 * =========================
 */
async function safeFetch<T>(
  promise: Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const data = await promise;
    return data ?? fallback;
  } catch (err) {
    console.error("SAFE FETCH FAILED:", err);
    return fallback;
  }
}

/**
 * =========================
 * POSTS (WORDPRESS)
 * =========================
 */

/**
 * Fetch latest posts (HARDENED)
 */
export async function getPosts() {
  return safeFetch(
    ssrFetch<WordPressPostWithMedia[]>(
      `${API_BASE}/posts?per_page=20&_embed=1`,
      { fallback: [] }
    ),
    []
  );
}

/**
 * Fetch single post by slug
 */
export async function getPostBySlug(slug: string) {
  return safeFetch(
    ssrFetch<WordPressPostWithMedia[]>(
      `${API_BASE}/posts?slug=${slug}&_embed=1`,
      { fallback: [] }
    ).then((data) => data?.[0] || null),
    null
  );
}

/**
 * Fetch all categories
 */
export async function getCategories() {
  return safeFetch(
    ssrFetch<any[]>(
      `${API_BASE}/categories?per_page=100`,
      { fallback: [] }
    ),
    []
  );
}

/**
 * Fetch posts by category slug
 */
export async function getCategoryPosts(slug: string) {
  return safeFetch(
    (async () => {
      const categories = await ssrFetch<any[]>(
        `${API_BASE}/categories?slug=${slug}`,
        { fallback: [] }
      );

      const category = categories?.[0];

      if (!category?.id) return [];

      return ssrFetch<WordPressPostWithMedia[]>(
        `${API_BASE}/posts?categories=${category.id}&per_page=20&_embed=1`,
        { fallback: [] }
      );
    })(),
    []
  );
}

/**
 * =========================
 * LIVE SCORES (ESPN)
 * =========================
 */

/**
 * Fetch live Premier League scores (HARDENED)
 */
export async function getScores() {
  return safeFetch(
    fetch(
      "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",
      {
        next: { revalidate: 30 },
      }
    )
      .then(async (res) => {
        if (!res.ok) return [];

        const data = await res.json();

        const events = Array.isArray(data?.events)
          ? data.events
          : [];

        return mapEspnMatches(events);
      }),
    []
  );
}