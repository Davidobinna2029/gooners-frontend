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
 * VALIDATION (NO FALLBACK RULES)
 * =========================
 */
function isValid(url?: string): url is string {
  if (!url || typeof url !== "string") return false;

  const clean = url.trim();

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
 * FEATURED IMAGE ONLY (SOURCE OF TRUTH)
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
 * STRICT RESOLVER (NO FALLBACK CHAIN)
 * =========================
 */
export function resolveWordPressImage(
  post: WordPressPostWithMedia
): string {
  const url = getFeatured(post);

  if (!isValid(url)) {
    throw new Error(`Missing featured image for post ID: ${post?.id}`);
  }

  return normalize(url);
}