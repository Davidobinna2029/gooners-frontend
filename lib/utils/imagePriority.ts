export type ImagePriority = "high" | "medium" | "low";

/**
 * Controls loading behavior across the app
 * - high: above-the-fold (Hero, MatchHero)
 * - medium: visible on load (Breaking, Trending)
 * - low: below fold (grid, extras)
 */
export function getImagePriority(index: number): ImagePriority {
  if (index === 0) return "high";
  if (index <= 3) return "medium";
  return "low";
}