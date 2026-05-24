import { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * GLOBAL FALLBACK IMAGE
 */
const FALLBACK_IMAGE = "/fallback.jpg";

/**
 * Normalize unsafe URLs
 */
function normalize(url?: string): string {
  if (!url || typeof url !== "string") return FALLBACK_IMAGE;

  const cleaned = url.trim();

  if (!cleaned || cleaned === "null" || cleaned === "undefined") {
    return FALLBACK_IMAGE;
  }

  if (cleaned.startsWith("//")) return `https:${cleaned}`;

  if (!/^https?:\/\//.test(cleaned)) return FALLBACK_IMAGE;

  return cleaned;
}

/**
 * STEP 1: Try embedded media
 */
function fromEmbedded(post: WordPressPostWithMedia): string | null {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null
  );
}

/**
 * STEP 2: Try media sizes (backup layer)
 */
function fromMediaSizes(post: WordPressPostWithMedia): string | null {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  return (
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    null
  );
}

/**
 * STEP 3: Try WordPress direct fields (some APIs expose this)
 */
function fromDirect(post: any): string | null {
  return (
    post?.featured_image_url ||
    post?.jetpack_featured_media_url ||
    null
  );
}

/**
 * FINAL RESOLVER (ZERO FAIL GUARANTEE)
 */
export function resolvePostImage(
  post: WordPressPostWithMedia
): string {
  const raw =
    fromEmbedded(post) ||
    fromMediaSizes(post) ||
    fromDirect(post);

  return normalize(raw || undefined);
}