import type { CanonicalPost } from "@/types/content";

const FALLBACK = "/fallback.jpg";

/**
 * SAFE IMAGE ACCESSOR
 */
export function getImage(post: CanonicalPost): string {
  const imageUrl = post.image?.url;

  if (!imageUrl) return FALLBACK;

  // local image
  if (imageUrl.startsWith("/")) return imageUrl;

  return imageUrl;
}