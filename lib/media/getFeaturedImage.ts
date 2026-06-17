import type { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * =========================
 * FEATURED IMAGE RESOLVER (CLEAN + SAFE)
 * =========================
 * - Strict WordPress featured media only
 * - Normalized URLs
 * - No fallback logic (UI handles fallback)
 */

const MEDIA_HOST_REWRITE = "https://api.arsenaltalks.com";

/**
 * Normalize all known WP URL formats
 */
function normalize(url: string): string {
  return url
    .trim()
    .replace(/^http:\/\/arsenaltalks\.com/i, MEDIA_HOST_REWRITE)
    .replace(/^https:\/\/arsenaltalks\.com/i, MEDIA_HOST_REWRITE)
    .replace(/^http:\/\/www\.arsenaltalks\.com/i, MEDIA_HOST_REWRITE)
    .replace(/^https:\/\/www\.arsenaltalks\.com/i, MEDIA_HOST_REWRITE)
    .replace(/^\/\/arsenaltalks\.com/i, MEDIA_HOST_REWRITE);
}

/**
 * Validate real image URL
 */
function isValid(url: unknown): url is string {
  if (typeof url !== "string") return false;

  const clean = url.trim();

  if (!clean) return false;

  if (!clean.startsWith("http://") && !clean.startsWith("https://") && !clean.startsWith("//")) {
    return false;
  }

  if (clean.includes("placeholder") || clean.includes("default")) {
    return false;
  }

  return true;
}

/**
 * =========================
 * MAIN RESOLVER
 * =========================
 */
export function getFeaturedImage(
  post: WordPressPostWithMedia
): string | null {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  const sizes = media?.media_details?.sizes;

  const rawUrl =
    sizes?.full?.source_url ||
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    sizes?.medium?.source_url ||
    sizes?.thumbnail?.source_url ||
    media?.source_url ||
    null;

  if (!isValid(rawUrl)) {
    return null;
  }

  return normalize(rawUrl);
}