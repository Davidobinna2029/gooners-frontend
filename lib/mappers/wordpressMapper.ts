import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import type { CanonicalPost } from "@/types/content";
import { getFeaturedImage } from "@/lib/media/getFeaturedImage";

function strip(html?: string): string {
  if (typeof html !== "string") return "";

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
  post: WordPressPostWithMedia
): CanonicalPost {
  const imageUrl = getFeaturedImage(post);

  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: strip(post.title?.rendered),
    excerpt: strip(post.excerpt?.rendered),

    // IMPORTANT: KEEP RAW HTML for content rendering
    content: post.content?.rendered ?? "",

    // ONLY SOURCE OF IMAGE
    image: imageUrl ? { url: imageUrl } : null,

    categories: safeArray(post.categories),
    tags: safeArray(post.tags),

    link: post.link,

    score: 0,
    cluster: undefined,
  };
}

export function mapWordPressPosts(posts: WordPressPostWithMedia[]) {
  if (!Array.isArray(posts)) return [];
  return posts.map(mapWordPressPost);
}