import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import type { CanonicalPost, MediaImage } from "@/types/content";
import { getFeaturedImage } from "@/lib/media/getFeaturedImage";

/**
 * =========================
 * HTML STRIP (SAFE)
 * =========================
 */
function strip(html?: string): string {
  if (typeof html !== "string") return "";

  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<style[^>]*>.*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * =========================
 * SAFE ARRAY NORMALIZER
 * =========================
 */
function safeArray(input: unknown): number[] {
  return Array.isArray(input) ? input : [];
}

/**
 * =========================
 * WORDPRESS → CANONICAL POST
 * =========================
 */
export function mapWordPressPost(
  post: WordPressPostWithMedia
): CanonicalPost {
  const imageUrl = getFeaturedImage(post);

  const image: MediaImage | null = imageUrl
    ? {
        url: imageUrl,
        width: undefined,
        height: undefined,
      }
    : null;

  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: strip(post.title?.rendered),
    excerpt: strip(post.excerpt?.rendered),
    content: post.content?.rendered ?? "",

    /**
     * =========================
     * IMAGE (STRICT SOURCE ONLY)
     * =========================
     */
    image,

    categories: safeArray(post.categories),
    tags: safeArray(post.tags),

    link: post.link,

    /**
     * =========================
     * SYSTEM METADATA
     * =========================
     */
    score: 0,
    cluster: undefined,
  };
}