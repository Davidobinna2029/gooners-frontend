import { WordPressPostWithMedia } from "@/types/wordpress-media";

const FALLBACK = "";

/**
 * Extract WP featured image
 */
function getFeatured(post: WordPressPostWithMedia): string {
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
 * Extract content image fallback
 */
function getContent(post: WordPressPostWithMedia): string {
  const html = post?.content?.rendered || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || "";
}

/**
 * CLEAN NORMALIZER
 */
function normalize(url: string): string {
  if (!url) return "";

  if (url.startsWith("//")) return `https:${url}`;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return "";
}

/**
 * FINAL RESOLVER (SYNC ONLY)
 */
export function resolveWordPressImage(post: WordPressPostWithMedia): string {
  const raw = getFeatured(post) || getContent(post);

  return normalize(raw) || FALLBACK;
}