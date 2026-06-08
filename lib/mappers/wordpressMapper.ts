import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import type { CanonicalPost } from "@/types/content";

function strip(html?: string): string {
  if (!html) return "";

  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<style[^>]*>.*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function safeArray(input: unknown): number[] {
  return Array.isArray(input) ? input : [];
}

export function mapWordPressPost(
  post: WordPressPostWithMedia & { image?: string | null }
): CanonicalPost {
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,
    title: strip(post.title?.rendered),
    excerpt: strip(post.excerpt?.rendered),
    content: strip(post.content?.rendered),

    image: post.image ? { url: post.image } : null,

    categories: safeArray(post.categories),
    tags: safeArray(post.tags),

    link: post.link,
    score: 0,
    cluster: undefined,
  };
}

export function mapWordPressPosts(
  posts: WordPressPostWithMedia[]
): CanonicalPost[] {
  if (!Array.isArray(posts)) return [];
  return posts.map(mapWordPressPost);
}