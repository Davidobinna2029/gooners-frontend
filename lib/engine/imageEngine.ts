import type { WordPressPostWithMedia } from "@/types/wordpress-media";

const FALLBACK = "/fallback.jpg";

/**
 * =========================
 * EXTRACT WP IMAGE
 * =========================
 */
function extract(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes;

  return (
    sizes?.full?.source_url ||
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    media?.source_url ||
    ""
  );
}

/**
 * =========================
 * CDN NORMALIZER (IMPORTANT)
 * =========================
 */
function normalize(url: string): string {
  if (!url) return FALLBACK;

  if (url.startsWith("//")) return `https:${url}`;

  if (!url.startsWith("http")) return FALLBACK;

  return url;
}

/**
 * =========================
 * ESPN IMAGE ENGINE (FINAL)
 * =========================
 */
export function resolveBestImage(post: WordPressPostWithMedia): string {
  const raw = extract(post);
  return normalize(raw);
}