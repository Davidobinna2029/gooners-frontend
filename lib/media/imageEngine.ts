import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import { resolveWordPressImage } from "@/lib/media/resolveWordPressImage";

/**
 * =========================
 * IMAGE QUALITY TIERS (ESPN STYLE)
 * =========================
 */
const IMAGE_PRIORITY = [
  "full",
  "large",
  "medium_large",
  "medium",
  "thumbnail",
] as const;

/**
 * =========================
 * CONTEXTUAL IMAGE BOOSTING
 * =========================
 */
function detectImageContext(text: string): "match" | "transfer" | "injury" | "general" {
  const t = text.toLowerCase();

  if (t.includes("vs") || t.includes("match") || t.includes("lineup")) return "match";
  if (t.includes("transfer") || t.includes("signing") || t.includes("deal")) return "transfer";
  if (t.includes("injury") || t.includes("fitness") || t.includes("sidelined")) return "injury";

  return "general";
}

/**
 * =========================
 * IMAGE SCORE BOOSTER
 * =========================
 */
function boostImageUrl(url: string, context: string): number {
  let score = 0;

  if (!url) return 0;

  // Higher resolution bias
  if (url.includes("full")) score += 40;
  if (url.includes("large")) score += 30;
  if (url.includes("medium")) score += 15;

  // Context boost (ESPN editorial logic)
  if (context === "match" && url.includes("stadium")) score += 20;
  if (context === "transfer" && url.includes("player")) score += 15;
  if (context === "injury" && url.includes("medical")) score += 15;

  return score;
}

/**
 * =========================
 * PRIMARY IMAGE RESOLVER (ESPN ENGINE)
 * =========================
 */
export function resolveBestImage(post: WordPressPostWithMedia): string {
  const baseImage = resolveWordPressImage(post);

  const text = `${post.title?.rendered ?? ""} ${post.excerpt?.rendered ?? ""}`;
  const context = detectImageContext(text);

  const embedded = post?._embedded?.["wp:featuredmedia"]?.[0];

  if (!embedded) return baseImage;

  const sizes = embedded.media_details?.sizes;

  const candidates: string[] = [
    sizes?.full?.source_url,
    sizes?.large?.source_url,
    sizes?.medium_large?.source_url,
    sizes?.medium?.source_url,
    sizes?.thumbnail?.source_url,
    embedded?.source_url,
  ].filter(Boolean) as string[];

  if (candidates.length === 0) return baseImage;

  let best = baseImage;
  let bestScore = 0;

  for (const url of candidates) {
    const score =
      boostImageUrl(url, context) +
      (url === baseImage ? 10 : 0);

    if (score > bestScore) {
      bestScore = score;
      best = url;
    }
  }

  return best || baseImage;
}