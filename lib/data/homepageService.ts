// lib/data/HomepageService.ts

import { getPosts } from "@/lib/api/wordpress";
import { rankTrending } from "@/lib/orchestrator/trending";
import { rankHomepagePosts } from "@/lib/orchestrator/homepage";
import { normalizePosts } from "@/lib/mappers/wordpressMapper";

export async function getHomepageData() {
  // 1. Fetch raw WordPress data safely
  const rawPosts = await getPosts();

  // 2. Normalize FIRST (critical fix)
  const normalizedPosts = normalizePosts(rawPosts || []);

  // 3. Apply homepage ranking
  const posts = rankHomepagePosts(normalizedPosts);

  // 4. Apply trending ranking
  const trending = rankTrending(normalizedPosts);

  return {
    posts,
    trending,
  };
}