import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import type { CanonicalPost } from "@/types/content";
import { getFeaturedImage } from "@/lib/utils/getFeaturedImage";

/**
 * =========================
 * HTML CLEANER
 * =========================
 */
function strip(html?: string): string {
  if (!html) return "";

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

  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: strip(post.title?.rendered),
    excerpt: strip(post.excerpt?.rendered),
    content: strip(post.content?.rendered),

    /**
     * =========================
     * FIXED IMAGE MAPPING
     * =========================
     * Always derived from _embedded media
     */
    image: imageUrl
      ? {
          url: imageUrl,
        }
      : null,

    categories: safeArray(post.categories),
    tags: safeArray(post.tags),

    link: post.link,

    /**
     * =========================
     * DEFAULT SYSTEM VALUES
     * =========================
     */
    score: 0,
    cluster: "other",
  };
}

/**
 * =========================
 * BATCH MAPPER
 * =========================
 */
export function mapWordPressPosts(
  posts: WordPressPostWithMedia[]
): CanonicalPost[] {
  if (!Array.isArray(posts)) return [];

  return posts.map(mapWordPressPost);
}