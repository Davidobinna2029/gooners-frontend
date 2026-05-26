import { WordPressPostWithMedia } from "@/types/wordpress-media";

const FALLBACK_IMAGE = "/fallback.jpg";

function normalizeImage(url?: string): string {
  if (typeof url !== "string") return FALLBACK_IMAGE;

  const clean = url.trim();

  if (!clean || clean === "null" || clean === "undefined" || clean.length < 10) {
    return FALLBACK_IMAGE;
  }

  if (clean.startsWith("//")) return `https:${clean}`;

  if (!/^https?:\/\//.test(clean)) return FALLBACK_IMAGE;

  return clean;
}

function extractWpImage(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes;

  return (
    media?.source_url ||
    sizes?.large?.source_url ||
    sizes?.medium?.source_url ||
    sizes?.full?.source_url ||
    sizes?.thumbnail?.source_url ||
    ""
  );
}

export function resolvePostImage(post: WordPressPostWithMedia): string {
  return normalizeImage(extractWpImage(post));
}