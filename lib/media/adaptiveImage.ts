import { NormalizedPost } from "@/lib/mappers/wordpressMapper";

/**
 * DEVICE BREAKPOINT STRATEGY
 */
type ImageContext = "hero" | "card" | "thumbnail";

/**
 * SIZE MAP (performance optimized)
 */
const SIZE_MAP: Record<ImageContext, number> = {
  hero: 1200,       // LCP critical
  card: 800,        // feed/grid
  thumbnail: 400,   // sidebar / small UI
};

/**
 * EDGE IMAGE ROUTER (central pipeline)
 */
function buildEdgeImage(url: string, width: number): string {
  if (!url || url.includes("fallback.jpg")) return "/fallback.jpg";

  return `/api/image?url=${encodeURIComponent(url)}&w=${width}&q=85`;
}

/**
 * MAIN ADAPTIVE IMAGE FUNCTION
 */
export function getAdaptiveImage(
  post: NormalizedPost,
  context: ImageContext = "card"
): string {
  const width = SIZE_MAP[context] || 800;

  if (!post?.image) return "/fallback.jpg";

  return buildEdgeImage(post.image, width);
}