import { API_BASE } from "./core/apiBase";
import { ssrFetch } from "./core/ssrFetch";
import type { WordPressPostWithMedia } from "@/types/wordpress-media";

const WP_EMBED = "_embed=1";

/**
 * STRICT WORDPRESS FETCH
 * - Uses _embed=1 only
 * - No fallback
 * - No retry
 * - Throws if WordPress fails
 */
export async function getPostsSafe(): Promise<
  WordPressPostWithMedia[]
> {
  const posts = await ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?per_page=5&${WP_EMBED}`
  );

  if (!Array.isArray(posts)) {
    throw new Error(
      "Invalid WordPress posts response"
    );
  }

  return posts;
}