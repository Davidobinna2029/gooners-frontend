import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import type { CanonicalPost, MediaImage } from "@/types/content";
import { resolveWordPressImage } from "@/lib/media/resolveWordPressImage";

/**
 * HTML STRIPPER
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
 * SAFE ARRAY
 */
function safeArray(input: unknown): number[] {
  return Array.isArray(input) ? input : [];
}

/**
 * IMAGE BUILDER (FIXED)
 */
function buildImage(post: WordPressPostWithMedia): MediaImage | null {
  const url = resolveWordPressImage(post);

  if (!url) return null;

  return {
    url,
  };
}

/**
 * CANONICAL MAPPER
 */
export function toCanonical(
  post: WordPressPostWithMedia
): CanonicalPost {
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: strip(post.title?.rendered),
    excerpt: strip(post.excerpt?.rendered),
    content: strip(post.content?.rendered),

    /**
     * FIX: MUST BE OBJECT, NOT STRING
     */
    image: buildImage(post),

    categories: safeArray(post.categories),
    tags: safeArray(post.tags),

    link: post.link,

    score: 0,
  };
}

/**
 * BULK
 */
export function toCanonicalPosts(
  posts: WordPressPostWithMedia[]
): CanonicalPost[] {
  if (!Array.isArray(posts)) return [];
  return posts.map(toCanonical);
}