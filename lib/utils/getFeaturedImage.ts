import type { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * Extracts featured image from WordPress REST API (_embed=1)
 * Handles multiple fallback structures for reliability in production (Vercel/Next.js SSR)
 */
export function getFeaturedImage(
  post: WordPressPostWithMedia
): string | null {
  if (!post) return null;

  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  if (!media) return null;

  return (
    // Most common WP REST API field
    media.source_url ||
    // Fallback for WP media sizes (sometimes more stable in production)
    media.media_details?.sizes?.full?.source_url ||
    media.media_details?.sizes?.large?.source_url ||
    media.media_details?.sizes?.medium?.source_url ||
    null
  );
}