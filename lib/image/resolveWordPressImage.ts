import type { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * =========================
 * STRICT URL NORMALIZER
 * =========================
 */
function normalize(url: string): string {
  const clean = url.trim();

  if (clean.startsWith("//")) {
    return `https:${clean}`;
  }

  return clean;
}

/**
 * =========================
 * VALIDATOR (REALISTIC ONLY)
 * =========================
 */
function isValid(url?: string): url is string {
  if (!url || typeof url !== "string") return false;

  const clean = url.trim();

  if (!clean.startsWith("http://") && !clean.startsWith("https://") && !clean.startsWith("//")) {
    return false;
  }

  // reject obvious garbage
  if (clean.includes("placeholder") || clean.includes("default")) return false;

  return true;
}

/**
 * =========================
 * FEATURED IMAGE (WP PRIMARY)
 * =========================
 */
function getFeatured(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes;

  return (
    sizes?.full?.source_url ||
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    sizes?.medium?.source_url ||
    sizes?.thumbnail?.source_url ||
    media?.source_url ||
    ""
  );
}

/**
 * =========================
 * CONTENT IMAGE FALLBACK
 * =========================
 */
function getContentImage(post: WordPressPostWithMedia): string {
  const html = post?.content?.rendered || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || "";
}

/**
 * =========================
 * ESPN IMAGE RESOLVER CORE
 * =========================
 */
export function resolveWordPressImage(
  post: WordPressPostWithMedia
): string {
  const candidates = [
    getFeatured(post),     // 100% priority
    getContentImage(post), // fallback
  ];

  for (const url of candidates) {
    if (isValid(url)) {
      return normalize(url);
    }
  }

  /**
   * IMPORTANT DESIGN DECISION:
   * No fake fallback image.
   * Let UI handle missing media gracefully.
   */
  return "";
}