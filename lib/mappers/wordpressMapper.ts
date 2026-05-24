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
 * CONSTANT FALLBACK
 */
const FALLBACK_IMAGE = "/fallback.jpg";

/**
 * SAFE IMAGE NORMALIZER (EDGE SAFE)
 */
function normalizeImage(url?: string): string {
  if (typeof url !== "string") return FALLBACK_IMAGE;

  const cleaned = url.trim();

  if (
    !cleaned ||
    cleaned === "null" ||
    cleaned === "undefined" ||
    cleaned.length < 10
  ) {
    return FALLBACK_IMAGE;
  }

  // protocol-relative fix
  if (cleaned.startsWith("//")) {
    return `https:${cleaned}`;
  }

  // strict http validation
  if (!/^https?:\/\//.test(cleaned)) {
    return FALLBACK_IMAGE;
  }

  return cleaned;
}

/**
 * EXTRACT WORDPRESS FEATURED IMAGE (SAFE NAVIGATION)
 */
function extractWpImage(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  // IMPORTANT: WP can return undefined sizes depending on theme
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
 * WORDPRESS FEATURED IMAGE RESOLVER (FINAL LAYER)
 */
function resolveImage(post: WordPressPostWithMedia): string {
  const rawImage = extractWpImage(post);
  return normalizeImage(rawImage);
}

/**
 * STRIP HTML SAFELY (WP CONTENT)
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

    categories: Array.isArray(post.categories)
      ? post.categories
      : [],

    tags: Array.isArray(post.tags)
      ? post.tags
      : [],
  };
}

/**
 * POSTS ARRAY MAPPER
 */
export function mapWordPressPosts(
  posts: WordPressPostWithMedia[]
): NormalizedPost[] {
  if (!Array.isArray(posts)) return [];
  return posts.map(mapWordPressPost);
}

/**
 * BACKWARD COMPATIBILITY LAYER (DO NOT BREAK OLD IMPORTS)
 */
export const normalizePosts = mapWordPressPosts;