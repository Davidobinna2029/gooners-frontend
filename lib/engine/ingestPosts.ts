import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import { resolveBestImage } from "./imageEngine";

export interface CanonicalPost {
  id: number;
  slug: string;
  date: string;

  title: string;
  excerpt: string;

  image: string;

  categories: number[];
  tags: number[];

  link?: string;

  score: number;
  cluster?: "arsenal" | "transfer" | "injury" | "match" | "other";
}

function strip(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

function safeArray(input: unknown): number[] {
  return Array.isArray(input) ? input : [];
}

export function ingestPost(post: WordPressPostWithMedia): CanonicalPost {
  const title = strip(post.title?.rendered);
  const excerpt = strip(post.excerpt?.rendered);

  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title,
    excerpt,

    image: resolveBestImage(post),

    categories: safeArray(post.categories),
    tags: safeArray(post.tags),

    link: post.link,

    score: 0,
    cluster: "other",
  };
}

export function ingestPosts(posts: WordPressPostWithMedia[]): CanonicalPost[] {
  if (!Array.isArray(posts)) return [];
  return posts.map(ingestPost);
}