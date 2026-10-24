
import type { WordPressPostWithMedia } from "@/types/wordpress-media";

const MEDIA_HOST = "api.arsenaltalks.com";

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const candidate = value.trim();

  try {
    const url = new URL(
      candidate.startsWith("//") ? `https:${candidate}` : candidate
    );

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    if (
      url.hostname === "arsenaltalks.com" ||
      url.hostname === "www.arsenaltalks.com"
    ) {
      url.hostname = MEDIA_HOST;
    }

    // Next.js remotePatterns currently allow HTTPS only.
    url.protocol = "https:";

    return url.toString();
  } catch {
    return null;
  }
}

export function getFeaturedImage(
  post: WordPressPostWithMedia
): string | null {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  if (!media) {
    return null;
  }

  const sizes = media.media_details?.sizes;

  const candidates = [
    sizes?.["1536x1536"]?.source_url,
    sizes?.["2048x2048"]?.source_url,
    sizes?.full?.source_url,
    sizes?.large?.source_url,
    sizes?.medium_large?.source_url,
    sizes?.medium?.source_url,
    media.source_url,
    sizes?.thumbnail?.source_url,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeImageUrl(candidate);

    if (normalized) {
      return normalized;
    }
  }

  return null;
}
