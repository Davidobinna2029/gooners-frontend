import { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * SAFE FALLBACK
 */
const FALLBACK_IMAGE = "/fallback.jpg";

/**
 * Extract best WP featured image
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
 * HARD SANITIZER (prevents broken Next/Image + Vercel crash)
 */
function sanitizeImage(url?: string): string {
  if (!url || typeof url !== "string") return FALLBACK_IMAGE;

  const clean = url.trim();

  if (
    clean === "null" ||
    clean === "undefined" ||
    clean.length < 10
  ) {
    return FALLBACK_IMAGE;
  }

  // protocol-relative
  if (clean.startsWith("//")) return `https:${clean}`;

  // enforce http(s)
  if (!/^https?:\/\//.test(clean)) {
    return FALLBACK_IMAGE;
  }

  return clean;
}

/**
 * PUBLIC API (USE EVERYWHERE IN UI)
 */
export function resolvePostImage(
  post: WordPressPostWithMedia
): string {
  const raw = extractWpImage(post);
  return sanitizeImage(raw);
}