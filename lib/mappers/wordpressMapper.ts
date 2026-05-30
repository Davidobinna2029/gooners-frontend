import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import { resolveWordPressImage } from "@/lib/media/resolveWordPressImage";

export interface NormalizedPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;

  /**
   * Image System
   */
  image: string;

  /**
   * Taxonomies
   */
  categories: number[];
  tags: number[];

  /**
   * Homepage Ranking
   * Used by Discover / Breaking / Trending feeds
   */
  score?: number;
}

function strip(html?: string): string {
  if (!html) return "";

  return html.replace(/<[^>]*>/g, "").trim();
}

export function mapWordPressPost(
  post: WordPressPostWithMedia
): NormalizedPost {
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: strip(post.title?.rendered) || "Untitled",
    excerpt: strip(post.excerpt?.rendered),

    image: resolveWordPressImage(post),

    categories: Array.isArray(post.categories)
      ? post.categories
      : [],

    tags: Array.isArray(post.tags)
      ? post.tags
      : [],

    /**
     * Default score.
     * Discover ranking engine can overwrite later.
     */
    score: 0,
  };
}

export function mapWordPressPosts(
  posts: WordPressPostWithMedia[]
): NormalizedPost[] {
  if (!Array.isArray(posts)) return [];

  return posts.map(mapWordPressPost);
}