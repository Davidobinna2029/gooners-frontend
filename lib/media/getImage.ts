import type { CanonicalPost } from "@/types/content";

const FALLBACK = "/fallback.jpg";

/**
 * FINAL SAFE IMAGE PIPELINE
 * CanonicalPost -> MediaImage -> Next/Image (ESPN LAYER)
 */
export function getImage(
  post: CanonicalPost,
  width = 1200,
  quality = 85
): string {
  const image = post?.image;

  // STRICT ESPN TYPE (no legacy branching anymore)
  const imageUrl = image?.url;

  if (!imageUrl) return FALLBACK;

  // local images
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  return `/api/image?url=${encodeURIComponent(
    imageUrl
  )}&w=${width}&q=${quality}`;
}