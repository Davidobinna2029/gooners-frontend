import type { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * =========================
 * URL NORMALIZER
 * =========================
 */
export function normalize(url?: string): string | null {
  if (!url || typeof url !== "string") return null;

  const clean = url.trim();
  if (!clean) return null;

  // protocol-relative
  if (clean.startsWith("//")) return `https:${clean}`;

  // strict http(s)
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return null;
}

/**
 * =========================
 * FEATURED IMAGE EXTRACTOR
 * =========================
 */
export function extractFeatured(
  post: WordPressPostWithMedia
): string | null {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes;

  return (
    sizes?.full?.source_url ||
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    sizes?.medium?.source_url ||
    media?.source_url ||
    null
  );
}

/**
 * =========================
 * CONTENT IMAGE EXTRACTOR
 * =========================
 */
export function extractContent(
  post: WordPressPostWithMedia
): string | null {
  const html = post?.content?.rendered || "";

  const match = html.match(
    /<img[^>]+src=["']([^"']+)["']/i
  );

  return match?.[1] || null;
}

/**
 * =========================
 * GUID REMOVED (IMPORTANT FIX)
 * =========================
 *
 * ❌ WordPress REST API type does NOT guarantee guid on embedded posts
 * ❌ This was causing TypeScript build failure
 * ❌ Also not needed for image resolution
 *
 * Keeping engine clean:
 * featured → content fallback only
 */