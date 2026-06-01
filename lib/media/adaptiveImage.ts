import type { CanonicalPost } from "@/types/content";

type ImageContext = "hero" | "card" | "thumbnail";

const SIZE_MAP: Record<ImageContext, number> = {
  hero: 1200,
  card: 800,
  thumbnail: 400,
};

/**
 * SAFE IMAGE EXTRACTOR (handles BOTH old + new system temporarily)
 */
function getImageUrl(post: CanonicalPost): string {
  const image: any = post?.image;

  if (!image) return "";

  // NEW ESPN FORMAT
  if (typeof image === "object" && image.url) {
    return image.url;
  }

  // LEGACY SAFETY (during migration)
  if (typeof image === "string") {
    return image;
  }

  return "";
}

/**
 * EDGE CDN ROUTER
 */
function buildEdgeImage(url: string, width: number): string {
  if (!url || url.includes("fallback.jpg")) return "/fallback.jpg";

  return `/api/image?url=${encodeURIComponent(url)}&w=${width}&q=85`;
}

/**
 * MAIN ENGINE
 */
export function getAdaptiveImage(
  post: CanonicalPost,
  context: ImageContext = "card"
): string {
  const width = SIZE_MAP[context] ?? 800;

  const url = getImageUrl(post);

  if (!url) return "/fallback.jpg";

  return buildEdgeImage(url, width);
}