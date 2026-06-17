import type { CanonicalPost } from "@/types/content";

/**
 * =========================
 * SAFE IMAGE ACCESSOR (CLEAN)
 * =========================
 * - NO fallback image injection
 * - UI decides fallback behavior
 * - Strict single source of truth
 */

export function getImage(post: CanonicalPost): string | null {
  const imageUrl = post?.image?.url;

  if (!imageUrl || typeof imageUrl !== "string") {
    return null;
  }

  const trimmed = imageUrl.trim();

  if (trimmed.length === 0) {
    return null;
  }

  // local images (Next public folder)
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // external images
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return null;
}