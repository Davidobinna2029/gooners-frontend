import type { WordPressPostWithMedia } from "@/types/wordpress-media";

export function getFeaturedImage(
  post: WordPressPostWithMedia
): string | null {
  if (!post) return null;

  // 1. Embedded media (preferred)
  const embedded = post._embedded?.["wp:featuredmedia"]?.[0];

  const embeddedUrl =
    embedded?.source_url ||
    embedded?.media_details?.sizes?.full?.source_url ||
    embedded?.media_details?.sizes?.large?.source_url ||
    embedded?.media_details?.sizes?.medium?.source_url ||
    null;

  // 2. Fallback from REST field (VERY IMPORTANT)
  const mediaFieldUrl =
    (post as any)?.featured_media_url ||
    null;

  // 3. Direct WP fallback (sometimes exposed via plugins)
  const directUrl =
    (post as any)?.jetpack_featured_media_url ||
    null;

  return embeddedUrl || mediaFieldUrl || directUrl || null;
}