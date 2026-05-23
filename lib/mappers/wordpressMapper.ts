
import { WordPressPostWithMedia }
  from "@/types/wordpress-media";

/**
 * UI-safe normalized post (SINGLE SOURCE OF TRUTH)
 */
export interface NormalizedPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  image: string;
  categories: number[];
  tags: number[];
  score?: number;
}

/**
 * Resolve featured image safely
 */
function resolveImage(
  post: WordPressPostWithMedia
): string {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]
      ?.source_url ||
    "/fallback.jpg"
  );
}

/**
 * Strip HTML safely
 */
function stripHtml(html?: string): string {
  if (!html || typeof html !== "string") return "";

  return html
    .replace(/<[^>]*>/g, "")
    .trim();
}

/**
 * Normalize single post
 */
export function mapWordPressPost(
  post: WordPressPostWithMedia
): NormalizedPost {
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: stripHtml(post.title?.rendered),
    excerpt: stripHtml(post.excerpt?.rendered),

    image: resolveImage(post),

    categories: Array.isArray(post.categories)
      ? post.categories
      : [],

    tags: Array.isArray(post.tags)
      ? post.tags
      : [],
  };
}

/**
 * Normalize posts array
 */
export function mapWordPressPosts(
  posts: WordPressPostWithMedia[]
): NormalizedPost[] {
  if (!Array.isArray(posts)) return [];

  return posts.map(mapWordPressPost);
}

/**
 * OPTIONAL (IMPORTANT ADDITION)
 * Defensive alias so you don’t break old imports during migration
 */
export const normalizePosts = mapWordPressPosts;