import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import type { CanonicalPost } from "@/types/content";

/**
 * Strip HTML safely
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
 * Safe array helper
 */
function safeArray(input: unknown): number[] {
  return Array.isArray(input) ? input : [];
}

/**
 * MAIN MAPPER (CLEAN + API-AWARE)
 */
export function mapWordPressPost(
  post: WordPressPostWithMedia & {
    image?: string | null;
  }
): CanonicalPost {
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: strip(post.title?.rendered),
    excerpt: strip(post.excerpt?.rendered),
    content: strip(post.content?.rendered),

    /**
     * 🔥 NOW COMES DIRECTLY FROM API
     * No rebuild, no resolver, no MediaImage layer here
     */
    image: post.image ? { url: post.image } : null,

    categories: safeArray(post.categories),
    tags: safeArray(post.tags),

    link: post.link,

    score: 0,
    cluster: undefined,
  };
}

/**
 * BULK MAPPER
 */
export function mapWordPressPosts(
  posts: WordPressPostWithMedia[]
): CanonicalPost[] {
  if (!Array.isArray(posts)) return [];

  return posts.map(mapWordPressPost);
}