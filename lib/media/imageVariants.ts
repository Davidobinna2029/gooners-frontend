import { NormalizedPost } from "@/lib/mappers/wordpressMapper";

/**
 * ESPN STYLE IMAGE VARIANTS
 */
export type ImageVariant = "hero" | "card" | "ticker" | "thumbnail";

/**
 * SIZE MAP (OPTIMIZED FOR LAYOUT + LCP)
 */
const VARIANT_SIZES: Record<ImageVariant, string> = {
  hero: "1200w",
  card: "800w",
  ticker: "600w",
  thumbnail: "300w",
};

/**
 * GET ADAPTIVE IMAGE SIZE
 */
export function getAdaptiveImage(
  post: NormalizedPost,
  variant: ImageVariant = "card"
): string {
  const base = post.image;

  if (!base) return "/fallback.jpg";

  /**
   * If using your proxy system → inject sizing hint
   */
  const url = new URL("/api/image", window.location.origin);

  url.searchParams.set("url", base);
  url.searchParams.set("w", VARIANT_SIZES[variant]);

  return url.toString();
}