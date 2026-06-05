import type { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * Extract featured image from WP _embed
 * Returns string only (RAW URL)
 */
export function resolveWordPressImage(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  const url =
    media?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    "";

  if (!url) return "";

  return url.startsWith("//") ? `https:${url}` : url;
}