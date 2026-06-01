import type { WordPressPostWithMedia } from "@/types/wordpress-media";
import { mapWordPressPost } from "@/lib/mappers/wordpressMapper";
import type { CanonicalPost } from "@/types/content";

/**
 * Fixtures Mapper (WordPress → Canonical UI Model)
 * Thin wrapper around core mapper for consistency
 */
export function mapFixtures(
  posts: WordPressPostWithMedia[]
): CanonicalPost[] {
  if (!Array.isArray(posts)) return [];

  return posts.map(mapWordPressPost);
}