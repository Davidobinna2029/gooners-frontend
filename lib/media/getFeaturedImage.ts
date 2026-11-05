import type { WordPressPostWithMedia } from "@/types/wordpress-media";

const MEDIA_HOST = "https://api.arsenaltalks.com";

type UnknownRecord = Record<string, any>;

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;

  let candidate = value.trim().replace(/&(?:amp|#038);/gi, "&");

  if (candidate.startsWith("//")) {
    candidate = `https:${candidate}`;
  } else if (candidate.startsWith("/wp-content/uploads/")) {
    candidate = `${MEDIA_HOST}${candidate}`;
  }

  try {
    const url = new URL(candidate);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    if (
      url.hostname === "arsenaltalks.com" ||
      url.hostname === "www.arsenaltalks.com"
    ) {
      url.hostname = "api.arsenaltalks.com";
    }

    url.protocol = "https:";

    return url.toString();
  } catch {
    return null;
  }
}

export function getFeaturedImage(
  post: WordPressPostWithMedia | UnknownRecord | null | undefined
): string | null {
  if (!post) return null;

  // Treat optional custom WordPress fields as unknown data.
  const record = post as UnknownRecord;

  const media = record._embedded?.["wp:featuredmedia"]?.[0] as
    | UnknownRecord
    | undefined;

  const sizes = media?.media_details?.sizes as
    | Record<string, { source_url?: unknown }>
    | undefined;

  const candidates: unknown[] = [
    sizes?.["1536x1536"]?.source_url,
    sizes?.["2048x2048"]?.source_url,
    sizes?.full?.source_url,
    sizes?.large?.source_url,
    sizes?.medium_large?.source_url,
    media?.source_url,
    sizes?.medium?.source_url,
    sizes?.thumbnail?.source_url,
    record.featured_image_url,
    record.featured_media_url,
    record.jetpack_featured_media_url,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeImageUrl(candidate);
    if (normalized) return normalized;
  }

  return null;
}
