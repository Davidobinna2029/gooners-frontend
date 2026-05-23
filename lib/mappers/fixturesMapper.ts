import { WordPressPostWithMedia } from "@/types/wordpress-media";
import { mapWordPressPost } from "@/lib/mappers/wordpressMapper";
import { NormalizedPost } from "@/types/ui";

/**
 * Fixtures Mapper (WordPress → UI)
 * Thin wrapper around core mapper for consistency
 */
export function mapFixtures(
  posts: WordPressPostWithMedia[]
): NormalizedPost[] {
  if (!Array.isArray(posts)) return [];

  return posts.map(mapWordPressPost);
}