import { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * =========================
 * FALLBACK IMAGE (CRITICAL FIX)
 * =========================
 * Never allow empty UI state
 */
const FALLBACK =
  "/images/fallback/arsenal-default.jpg";

/**
 * =========================
 * FEATURED IMAGE (WP PRIORITY)
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
    media?.source_url ||
    ""
  );
}

/**
 * =========================
 * CONTENT IMAGE FALLBACK (SECONDARY SOURCE)
 * =========================
 */
function getContent(post: WordPressPostWithMedia): string {
  const html = post?.content?.rendered || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || "";
}

/**
 * =========================
 * URL NORMALIZER (SAFE)
 * =========================
 */
function normalize(url: string): string {
  if (!url) return "";

  const clean = url.trim();

  if (clean.startsWith("//")) {
    return `https:${clean}`;
  }

  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://")
  ) {
    return clean;
  }

  return "";
}

/**
 * =========================
 * FINAL ESPN-STYLE RESOLVER
 * =========================
 */
export function resolveWordPressImage(
  post: WordPressPostWithMedia
): string {
  const raw = getFeatured(post) || getContent(post);
  const cleaned = normalize(raw);

  /**
   * GUARANTEE LAYER:
   * Never return empty string to UI
   */
  return cleaned || FALLBACK;
}