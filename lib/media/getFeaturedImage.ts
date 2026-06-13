import type { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * =========================
 * FEATURED IMAGE RESOLVER (STRICT)
 * =========================
 * - No fallback images
 * - No external guesswork
 * - Only real WordPress media
 * - Normalized to api.arsenaltalks.com
 */

const MEDIA_HOST_REWRITE = "https://api.arsenaltalks.com";

function normalize(url: string): string {
  return url
    .replace(/^http:\/\/arsenaltalks\.com/i, MEDIA_HOST_REWRITE)
    .replace(/^https:\/\/arsenaltalks\.com/i, MEDIA_HOST_REWRITE)
    .replace(/^\/\/arsenaltalks\.com/i, MEDIA_HOST_REWRITE);
}

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

  if (!rawUrl || typeof rawUrl !== "string") {
    return null;
  }

  const cleaned = rawUrl.trim();

  if (!cleaned.startsWith("http")) {
    return null;
  }

  return normalize(cleaned);
}