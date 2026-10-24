
import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import type { CanonicalPost } from "@/types/content";
import { getFeaturedImage } from "@/lib/media/getFeaturedImage";
import { decode } from "html-entities";

function strip(html?: string): string {
  if (typeof html !== "string") {
    return "";
  }

  const stripped = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return decode(stripped);
}

function safeArray(input: unknown): number[] {
  return Array.isArray(input)
    ? input.filter(
        (item): item is number =>
          typeof item === "number" && Number.isFinite(item)
      )
    : [];
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
    content: post.content?.rendered ?? "",
    image: imageUrl ? { url: imageUrl } : null,
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
  if (!Array.isArray(posts)) {
    return [];
  }

  return posts.map(mapWordPressPost);
}
