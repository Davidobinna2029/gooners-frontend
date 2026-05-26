import { WordPressPostWithMedia } from "@/types/wordpress-media";

const FALLBACK_IMAGE = "/fallback.jpg";

/**
 * Extract WP image safely
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
 * HARD SAFE SANITIZER (CRITICAL)
 */
function sanitizeImage(url?: string): string {
  if (!url || typeof url !== "string") return FALLBACK_IMAGE;

  const clean = url.trim();

  if (!clean || clean === "null" || clean === "undefined") {
    return FALLBACK_IMAGE;
  }

  // protocol-relative fix
  if (clean.startsWith("//")) {
    return `https:${clean}`;
  }

  // FORCE absolute URLs only
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    return FALLBACK_IMAGE;
  }

  return clean;
}

/**
 * PUBLIC PIPELINE ENTRY
 */
export function resolvePostImage(post: WordPressPostWithMedia): string {
  const raw = extractWpImage(post);
  return sanitizeImage(raw);
}