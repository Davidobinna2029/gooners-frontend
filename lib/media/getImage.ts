import { NormalizedPost } from "@/lib/mappers/wordpressMapper";

const FALLBACK = "/fallback.jpg";

/**
 * FINAL SAFE IMAGE PIPELINE
 * WordPress -> Proxy -> Next/Image
 */
export function getImage(
  post: NormalizedPost,
  width = 1200,
  quality = 85
) {
  if (!post?.image) return FALLBACK;

  // local image
  if (post.image.startsWith("/")) {
    return post.image;
  }

  return `/api/image?url=${encodeURIComponent(
    post.image
  )}&w=${width}&q=${quality}`;
}