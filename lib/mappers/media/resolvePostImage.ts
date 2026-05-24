import { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * SINGLE SOURCE OF TRUTH
 */
const FALLBACK_IMAGE = "/fallback.jpg";

/**
 * Extract best available WordPress featured image
 */
function extractWpImage(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  return (
    media?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    media?.media_details?.sizes?.thumbnail?.source_url ||
    ""
  );
}

/**
 * STRICT IMAGE SANITIZER
 * Prevents:
 * - invalid Next/Image URLs
 * - Vercel SSR crashes
 * - corrupted WP media
 */
function sanitizeImage(url?: string): string {
  if (!url || typeof url !== "string") return FALLBACK_IMAGE;

  const clean = url.trim();

  // invalid states
  if (
    clean === "null" ||
    clean === "undefined" ||
    clean.length < 10
  ) {
    return FALLBACK_IMAGE;
  }

  // protocol-relative fix
  if (clean.startsWith("//")) {
    return `https:${clean}`;
  }

  // enforce valid protocol only
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    return FALLBACK_IMAGE;
  }

  return clean;
}

/**
 * FINAL PUBLIC RESOLVER
 * USE THIS IN ALL UI COMPONENTS
 */
export function resolvePostImage(
  post: WordPressPostWithMedia
): string {
  const rawImage = extractWpImage(post);
  return sanitizeImage(rawImage);
}