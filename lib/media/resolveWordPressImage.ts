import type { WordPressPostWithMedia } from "@/types/wordpress-media";

function normalize(url: string): string {
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

function isValid(url?: string): url is string {
  if (!url) return false;
  if (typeof url !== "string") return false;

  if (
    url.includes("placeholder") ||
    url.includes("default") ||
    url.trim() === ""
  ) {
    return false;
  }

  return true;
}

function getFeatured(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = media?.media_details?.sizes;

  return (
    sizes?.full?.source_url ||
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    sizes?.medium?.source_url ||
    sizes?.thumbnail?.source_url ||
    media?.source_url ||
    ""
  );
}

function getContentImage(post: WordPressPostWithMedia): string {
  const html = post?.content?.rendered || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || "";
}

export function resolveWordPressImage(
  post: WordPressPostWithMedia
): string {
  const candidates = [
    getFeatured(post),
    getContentImage(post),
  ];

  for (const url of candidates) {
    if (isValid(url)) {
      return normalize(url);
    }
  }

  return "";
}