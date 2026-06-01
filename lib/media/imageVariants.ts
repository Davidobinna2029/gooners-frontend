import type { CanonicalPost } from "@/types/content";

/**
 * =========================
 * ESPN STYLE IMAGE VARIANTS
 * =========================
 */

export type ImageVariant = "hero" | "card" | "thumbnail";

const SIZE_MAP: Record<ImageVariant, number> = {
  hero: 1200,
  card: 800,
  thumbnail: 400,
};

/**
 * EDGE IMAGE BUILDER
 */
function buildImage(url: string, width: number): string {
  if (!url || url.includes("fallback.jpg")) return "/fallback.jpg";

  return `/api/image?url=${encodeURIComponent(url)}&w=${width}&q=85`;
}

/**
 * SAFE IMAGE EXTRACTOR (handles CanonicalPost structure)
 */
function getImageUrl(post: CanonicalPost): string {
  const image: any = post?.image;

  if (!image) return "";

  // NEW FORMAT
  if (typeof image === "object" && image.url) {
    return image.url;
  }

  // LEGACY SAFETY (temporary migration support)
  if (typeof image === "string") {
    return image;
  }

  return "";
}

/**
 * MAIN VARIANT ENGINE
 */
export function getImageVariant(
  post: CanonicalPost,
  variant: ImageVariant = "card"
): string {
  const width = SIZE_MAP[variant] ?? 800;

  const url = getImageUrl(post);

  if (!url) return "/fallback.jpg";

  return buildImage(url, width);
}