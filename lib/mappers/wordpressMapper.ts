import type { WordPressPostWithMedia } from "@/types/wordpress-media";

/**
 * =========================
 * NORMALIZED POST TYPE
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
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * =========================
 * IMAGE VALIDATOR (STRICT)
 * =========================
 */
function isValidImage(url?: string): url is string {
  if (!url || typeof url !== "string") return false;

  const clean = url.trim();

  if (clean.length < 10) return false;

  if (clean.startsWith("//")) return true;

  return /^https?:\/\//.test(clean);
}

/**
 * =========================
 * EXTRACT FEATURED IMAGE (ROBUST WP HANDLING)
 * =========================
 */
function extractWpImage(post: WordPressPostWithMedia): string {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  if (!media) return "";

  const sizes = media?.media_details?.sizes;

  return (
    sizes?.full?.source_url ||
    sizes?.large?.source_url ||
    sizes?.medium_large?.source_url ||
    sizes?.medium?.source_url ||
    sizes?.thumbnail?.source_url ||
    media?.source_url ||
    ""
  );
}

/**
 * =========================
 * EXTRACT IMAGE FROM CONTENT (FALLBACK REAL DATA ONLY)
 * =========================
 */
function extractContentImage(post: WordPressPostWithMedia): string {
  const html = post?.content?.rendered || "";

  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);

  return match?.[1] || "";
}

/**
 * =========================
 * RESOLVE FINAL IMAGE (NO FAKE FALLBACKS)
 * =========================
 */
function resolveImage(post: WordPressPostWithMedia): string {
  const featured = extractWpImage(post);
  const content = extractContentImage(post);

  const final = featured || content;

  if (!isValidImage(final)) {
    return "";
  }

  if (final.startsWith("//")) {
    return `https:${final}`;
  }

  return final;
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