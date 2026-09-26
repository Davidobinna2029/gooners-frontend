import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import type { CanonicalPost } from "@/types/content";
import { getFeaturedImage } from "@/lib/media/getFeaturedImage";
import { decode } from "html-entities";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/800x450?text=ArsenalTalks";

/**
 * Strip HTML markup and decode HTML entities
 * returned by WordPress.
 *
 * Examples:
 * Monaco&#8217;s     -> Monaco’s
 * Arsenal &amp; Chelsea -> Arsenal & Chelsea
 * &ldquo;Arsenal&rdquo; -> “Arsenal”
 * Arsenal&nbsp;News -> Arsenal News
 */
function strip(html?: string): string {
  if (typeof html !== "string") return "";

  const stripped = html
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<style[^>]*>.*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return decode(stripped);
}

function safeArray(input: unknown): number[] {
  return Array.isArray(input) ? input : [];
}

export function mapWordPressPost(
  post: WordPressPostWithMedia
): CanonicalPost {
  const rawImage = getFeaturedImage(post);

  const imageUrl =
    typeof rawImage === "string" && rawImage.trim().length > 0
      ? rawImage
      : FALLBACK_IMAGE;

  return {
    id: post.id,
    slug: post.slug,
    date: post.date,

    title: strip(post.title?.rendered),
    excerpt: strip(post.excerpt?.rendered),

    content: post.content?.rendered ?? "",

    /**
     * NEVER NULL AGAIN — ALWAYS IMAGE EXISTS
     */
    image: {
      url: imageUrl,
    },

    categories: safeArray(post.categories),
    tags: safeArray(post.tags),

    link: post.link,

    score: 0,
    cluster: undefined,
  };
}

export function mapWordPressPosts(
  posts: WordPressPostWithMedia[]
) {
  if (!Array.isArray(posts)) return [];

  return posts.map(mapWordPressPost);
}