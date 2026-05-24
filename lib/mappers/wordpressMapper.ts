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
 * SAFE IMAGE NORMALIZER (FINAL)
 */
function normalizeImage(url?: string): string {
  if (!url || typeof url !== "string") return "/fallback.jpg";

  const cleaned = url.trim();

  if (
    !cleaned ||
    cleaned === "null" ||
    cleaned === "undefined"
  ) {
    return "/fallback.jpg";
  }

  // fix protocol-relative URLs
  if (cleaned.startsWith("//")) {
    return `https:${cleaned}`;
  }

  // must be valid http(s)
  if (!/^https?:\/\//.test(cleaned)) {
    return "/fallback.jpg";
  }

  return cleaned;
}

/**
 * WORDPRESS FEATURED IMAGE RESOLVER (SAFE + STABLE)
 */
function resolveImage(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  const url =
    media?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    media?.media_details?.sizes?.thumbnail?.source_url ||
    "";

  return normalizeImage(url);
}

/**
 * STRIP HTML
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
 * POSTS MAPPER
 */
export function mapWordPressPosts(
  posts: WordPressPostWithMedia[]
): NormalizedPost[] {
  if (!Array.isArray(posts)) return [];
  return posts.map(mapWordPressPost);
}

/**
 * BACKWARD COMPATIBILITY
 */
export const normalizePosts = mapWordPressPosts;