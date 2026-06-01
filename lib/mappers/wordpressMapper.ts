import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import type { CanonicalPost, MediaImage } from "@/types/content";

/**
 * =========================
 * HTML CLEANER
 * =========================
 */
function strip(html?: string): string {
  if (typeof html !== "string") return "";

  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<style[^>]*>.*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * =========================
 * SAFE ARRAY
 * =========================
 */
function safeArray(input: unknown): number[] {
  return Array.isArray(input) ? input : [];
}

/**
 * =========================
 * IMAGE RESOLVER (ESPN CORE)
 * ALWAYS RETURNS MediaImage
 * =========================
 */
function resolveImage(post: WordPressPostWithMedia): MediaImage {
  const url =
    (post as any)?.featured_media_url ||
    (post as any)?.image_url ||
    "";

  return {
    url: url || "/fallback.jpg",
  };
}

/**
 * =========================
 * CLUSTER ENGINE
 * =========================
 */
export type ClusterType =
  | "arsenal"
  | "transfer"
  | "injury"
  | "match"
  | "other";

function detectCluster(text: string): ClusterType {
  const t = text.toLowerCase();

  const rules: Record<ClusterType, string[]> = {
    injury: ["injury", "fitness", "sidelined", "recovery", "knock"],
    transfer: ["transfer", "deal", "bid", "signing", "target"],
    match: ["lineup", "kick", "vs", "fixture", "match", "champions league"],
    arsenal: ["arsenal", "arteta", "odegaard", "saka", "emirates"],
    other: [],
  };

  let best: ClusterType = "other";
  let bestScore = 0;

  for (const key of Object.keys(rules) as ClusterType[]) {
    let score = 0;

    for (const word of rules[key]) {
      if (t.includes(word)) score += 10;
    }

    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  }

  return best;
}

/**
 * =========================
 * CANONICAL MAPPER (LOCKED MODEL)
 * =========================
 */
export function mapWordPressPost(
  post: WordPressPostWithMedia
): CanonicalPost {
  const title = strip(post.title?.rendered);
  const excerpt = strip(post.excerpt?.rendered);
  const combined = `${title} ${excerpt}`;

  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title,
    excerpt,

    /**
     * 🔥 FIXED: ALWAYS MediaImage
     */
    image: resolveImage(post),

    categories: safeArray(post.categories),
    tags: safeArray(post.tags),

    link: post.link,

    score: 0,
    cluster: detectCluster(combined),
  };
}

/**
 * =========================
 * BULK MAPPER
 * =========================
 */
export function mapWordPressPosts(
  posts: WordPressPostWithMedia[]
): CanonicalPost[] {
  if (!Array.isArray(posts)) return [];
  return posts.map(mapWordPressPost);
}