import { ssrFetch } from "./core/ssrFetch";
import { API_BASE } from "./core/apiBase";

import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import { mapEspnMatches } from "@/lib/mappers/espnMatchMapper";

/**
 * =========================
 * POSTS (STRICT)
 * =========================
 */
export async function getPosts(): Promise<
  WordPressPostWithMedia[]
> {
  const data = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?per_page=20&_embed=1`
  );

  if (!Array.isArray(data)) {
    throw new Error("Invalid posts response from WordPress");
  }

  return data;
}

/**
 * =========================
 * SINGLE POST
 * =========================
 */
export async function getPostBySlug(
  slug: string
): Promise<WordPressPostWithMedia | null> {
  const data = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?slug=${slug}&_embed=1`
  );

  if (!Array.isArray(data)) {
    throw new Error("Invalid post response from WordPress");
  }

  return data[0] ?? null;
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

  if (!Array.isArray(data)) {
    throw new Error("Invalid categories response");
  }

  return data;
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

  if (!Array.isArray(categories)) {
    throw new Error("Invalid categories lookup response");
  }

  const categoryId = categories[0]?.id;

  if (!categoryId) {
    throw new Error("Category not found");
  }

  const data = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?categories=${categoryId}&per_page=20&_embed=1`
  );

  if (!Array.isArray(data)) {
    throw new Error("Invalid category posts response");
  }

  return data;
}

/**
 * =========================
 * LIVE SCORES (STRICT)
 * =========================
 */
export async function getScores() {
  const res = await fetch(
    "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",
    {
      next: { revalidate: 30 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch ESPN scores");
  }

  const data = await res.json();

  const events = Array.isArray(data?.events)
    ? data.events
    : [];

  return mapEspnMatches(events);
}