import type { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * =========================
 * FALLBACK IMAGE (SAFE DEFAULT)
 * =========================
 */
const FALLBACK_IMAGE = "/fallback.jpg";

/**
 * =========================
 * NORMALIZED POST TYPE (SINGLE SOURCE OF TRUTH)
 * =========================
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
 * =========================
 * SAFE HTML STRIPPER
 * =========================
 */
function stripHtml(html?: string): string {
  if (typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * =========================
 * IMAGE NORMALIZER (VERCEL + NEXT/IMAGE SAFE)
 * =========================
 */
function normalizeImage(url?: string): string {
  if (!url || typeof url !== "string") return FALLBACK_IMAGE;

  const clean = url.trim();

  if (
    clean === "" ||
    clean === "null" ||
    clean === "undefined" ||
    clean.length < 10
  ) {
    return FALLBACK_IMAGE;
  }

  // protocol-relative URLs
  if (clean.startsWith("//")) {
    return `https:${clean}`;
  }

  // enforce only valid http(s)
  if (!/^https?:\/\//.test(clean)) {
    return FALLBACK_IMAGE;
  }

  return clean;
}

/**
 * =========================
 * WORDPRESS FEATURED IMAGE EXTRACTOR (ROBUST)
 * =========================
 */
function extractWpImage(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  if (!media) return "";

  const sizes = media?.media_details?.sizes;

  return (
    sizes?.large?.source_url ||
    sizes?.medium?.source_url ||
    sizes?.thumbnail?.source_url ||
    media?.source_url ||
    ""
  );
}

/**
 * =========================
 * FINAL IMAGE RESOLVER
 * =========================
 */
function resolveImage(post: WordPressPostWithMedia): string {
  return normalizeImage(extractWpImage(post));
}

/**
 * =========================
 * MAP SINGLE POST
 * =========================
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
 * =========================
 * MAP POSTS ARRAY
 * =========================
 */
export function mapWordPressPosts(
  posts: WordPressPostWithMedia[]
): NormalizedPost[] {
  if (!Array.isArray(posts)) return [];
  return posts.map(mapWordPressPost);
}

/**
 * =========================
 * BACKWARD COMPATIBILITY (SAFE LEGACY SUPPORT)
 * =========================
 */
export const normalizePosts = mapWordPressPosts;