import type { WordPressPostWithMedia } from "@/types/wordpress-media";

const MEDIA_HOST_REWRITE = "https://api.arsenaltalks.com";

function normalize(url: string): string {
  return url
    .trim()
    .replace(/^http:\/\/arsenaltalks\.com/i, MEDIA_HOST_REWRITE)
    .replace(/^https:\/\/arsenaltalks\.com/i, MEDIA_HOST_REWRITE)
    .replace(/^\/\/arsenaltalks\.com/i, MEDIA_HOST_REWRITE);
}

export function getFeaturedImage(
  post: WordPressPostWithMedia
): string | null {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes;

  const url =
    sizes?.full?.source_url ||
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    sizes?.medium?.source_url ||
    sizes?.thumbnail?.source_url ||
    media?.source_url ||
    null;

  if (!url || typeof url !== "string") return null;

  return normalize(url);
}