// lib/data/HomepageService.ts

import { getPosts } from "@/lib/api/wordpress";
import { mapWordPressPosts } from "@/lib/mappers/wordpressMapper";
import { buildHomepageFeed } from "@/lib/orchestrator/homepage";
import { rankTrending } from "@/lib/orchestrator/trending";

export async function getHomepageData() {
  // 1. Fetch raw WordPress data safely
  const rawPosts = await getPosts().catch(() => []);

  // 2. Normalize FIRST (critical fix)
  const normalizedPosts = mapWordPressPosts(rawPosts || []);

  // 3. SINGLE SOURCE OF TRUTH FEED ENGINE
  const feed = buildHomepageFeed(normalizedPosts);

  // 4. Trending is derived separately (OK)
  const trending = rankTrending(normalizedPosts);

  return {
    posts: feed.hero,        // or feed.breaking if needed
    breaking: feed.breaking,
    trending,
    editors: feed.editors,
    transfer: feed.transfer,
    featured: feed.featured,
  };
}