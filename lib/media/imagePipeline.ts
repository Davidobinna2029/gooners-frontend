import type { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * =========================================
 * BULLETPROOF IMAGE PIPELINE (ESPN STYLE)
 * =========================================
 */

export const FALLBACK_IMAGE = "/fallback.jpg";

/**
 * STEP 1 — STRICT NORMALIZER
 * Ensures every URL is safe for Next/Image
 */
export function normalizeImage(url?: string): string {
  if (!url || typeof url !== "string") return "";

  const clean = url.trim();

  if (
    clean === "" ||
    clean === "null" ||
    clean === "undefined" ||
    clean.length < 10
  ) {
    return "";
  }

  if (clean.startsWith("//")) return `https:${clean}`;

  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    return "";
  }

  return clean;
}

/**
 * STEP 2 — WORDPRESS FEATURED IMAGE EXTRACTION
 * Handles all WP theme variations safely
 */
export function extractWpImage(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  if (!media) return "";

  const sizes = media?.media_details?.sizes;

  const raw =
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    sizes?.medium?.source_url ||
    sizes?.thumbnail?.source_url ||
    media?.source_url ||
    "";

  return normalizeImage(raw);
}

/**
 * STEP 3 — MASTER IMAGE RESOLVER
 * ALWAYS returns a safe usable image OR fallback
 */
export function resolveImage(post: WordPressPostWithMedia): string {
  const wpImage = extractWpImage(post);

  if (wpImage) return wpImage;

  return FALLBACK_IMAGE;
}

/**
 * STEP 4 — OPTIONAL PROXY LAYER (ESPN MODE)
 * Use only if you need caching / bypass issues
 */
export function getProxyImage(url?: string): string {
  if (!url) return FALLBACK_IMAGE;

  return `/api/image?url=${encodeURIComponent(url)}`;
}

/**
 * STEP 5 — FINAL PUBLIC API (USE THIS IN ALL COMPONENTS)
 * Switch between direct or proxy mode
 */
export function getSafeImage(
  post: WordPressPostWithMedia,
  mode: "direct" | "proxy" = "direct"
): string {
  const image = resolveImage(post);

  if (!image) return FALLBACK_IMAGE;

  return mode === "proxy" ? getProxyImage(image) : image;
}