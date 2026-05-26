import { WordPressPostWithMedia } from "@/types/wordpress-media";

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
 * CONSTANT FALLBACK (CRITICAL FOR VERCEL STABILITY)
 */
const FALLBACK_IMAGE = "/fallback.jpg";

/**
 * STRICT IMAGE NORMALIZER (Next/Image SAFE)
 */
function normalizeImage(url?: string): string {
  if (typeof url !== "string") return FALLBACK_IMAGE;

  const clean = url.trim();

  if (
    clean === "" ||
    clean === "null" ||
    clean === "undefined" ||
    clean.length < 10
  ) {
    return FALLBACK_IMAGE;
  }

  // protocol-relative fix (//domain.com/image.jpg)
  if (clean.startsWith("//")) {
    return `https:${clean}`;
  }

  // enforce absolute URLs only
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    return FALLBACK_IMAGE;
  }

  return clean;
}

/**
 * WORDPRESS FEATURED IMAGE EXTRACTOR (ROBUST)
 */
function extractWpImage(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  if (!media) return "";

  const sizes = media?.media_details?.sizes;

  return (
    media?.source_url ||
    sizes?.large?.source_url ||
    sizes?.medium?.source_url ||
    sizes?.full?.source_url ||
    sizes?.thumbnail?.source_url ||
    ""
  );
}

/**
 * FINAL IMAGE RESOLVER (USE EVERYWHERE IN UI)
 */
function resolveImage(post: WordPressPostWithMedia): string {
  const raw = extractWpImage(post);
  return normalizeImage(raw);
}

/**
 * STRIP WP HTML SAFELY
 */
function stripHtml(html?: string): string {
  if (typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * SINGLE POST MAPPER
 */
export function mapWordPressPost(
  post: WordPressPostWithMedia
): NormalizedPost {
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: stripHtml(post.title?.rendered) || "Untitled",
    excerpt: stripHtml(post.excerpt?.rendered) || "",

    image: resolveImage(post),

    categories: Array.isArray(post.categories) ? post.categories : [],
    tags: Array.isArray(post.tags) ? post.tags : [],
  };
}

/**
 * POSTS MAPPER
 */
export function mapWordPressPosts(
  posts: WordPressPostWithMedia[]
): NormalizedPost[] {
  if (!Array.isArray(posts)) return [];
  return posts.map(mapWordPressPost);
}

/**
 * BACKWARD COMPATIBILITY (DO NOT BREAK IMPORTS)
 */
export const normalizePosts = mapWordPressPosts;