import { API_BASE } from "./core/apiBase";
import { ssrFetch } from "./core/ssrFetch";
import type { WordPressPostWithMedia } from "@/types/wordpress-media";

const WP_EMBED = "_embed=1";

/**
 * PRIMARY FETCH (with embed)
 */
async function fetchWithEmbed() {
  return ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?per_page=20&${WP_EMBED}`,
    { fallback: [] }
  );
}

/**
 * FALLBACK FETCH (NO EMBED - GUARANTEED POSTS)
 */
async function fetchWithoutEmbed() {
  return ssrFetch<WordPressPostWithMedia[]>(
    `${API_BASE}/posts?per_page=20`,
    { fallback: [] }
  );
}

/**
 * AUTO RETRY WRAPPER (ESPN STYLE RESILIENCE)
 */
export async function getPostsSafe(): Promise<WordPressPostWithMedia[]> {
  let posts = await fetchWithEmbed();

  /**
   * If embed failed or empty featured media → retry without embed
   */
  const hasImages = posts?.some(
    (p) => p?._embedded?.["wp:featuredmedia"]?.length
  );

  if (!posts.length || !hasImages) {
    console.warn("WP _embed failed → retrying fallback fetch");
    posts = await fetchWithoutEmbed();
  }

  return posts;
}