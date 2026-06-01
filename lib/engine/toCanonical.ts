import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import type { CanonicalPost } from "@/types/content";
import { resolveWordPressImage } from "@/lib/media/resolveWordPressImage";

function strip(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

function safeArray(input: unknown): number[] {
  return Array.isArray(input) ? input : [];
}

export function toCanonical(post: WordPressPostWithMedia): CanonicalPost {
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: strip(post.title?.rendered),
    excerpt: strip(post.excerpt?.rendered),
    content: strip(post.content?.rendered),

    image: {
      url: resolveWordPressImage(post) || "/fallback.jpg",
    },

    categories: safeArray(post.categories),
    tags: safeArray(post.tags),

    link: post.link,

    score: 0,
  };
}