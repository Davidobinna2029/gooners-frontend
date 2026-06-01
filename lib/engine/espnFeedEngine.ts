import type { CanonicalPost } from "@/types/content";
import { clusterPosts } from "./clusterPost";
import { scorePost } from "./discoverRanker";

/**
 * =========================
 * STEP 1: ENRICH POSTS
 * =========================
 */
function enrich(posts: CanonicalPost[]) {
  return posts.map((post) => {
    const score = scorePost(post);

    return {
      ...post,
      score,
    };
  });
}

/**
 * =========================
 * STEP 2: CLUSTER FIRST
 * =========================
 */
function clusterAndRank(posts: CanonicalPost[]) {
  const clusters = clusterPosts(posts);

  const rankedClusters = Object.fromEntries(
    Object.entries(clusters).map(([key, items]) => {
      const sorted = [...items].sort(
        (a, b) => (b.score ?? 0) - (a.score ?? 0)
      );

      return [key, sorted];
    })
  );

  return rankedClusters;
}

/**
 * =========================
 * STEP 3: ESPN FEED BUILDER
 * =========================
 */
export function buildESPNFeed(posts: CanonicalPost[]) {
  const enriched = enrich(posts);
  const clusters = clusterAndRank(enriched);

  const all = enriched.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return {
    /**
     * HERO = BEST STORY FROM EACH CLUSTER + GLOBAL TOP
     */
    hero: [
      clusters.arsenal?.[0],
      clusters.transfers?.[0],
      clusters.injury?.[0],
      clusters.match?.[0],
      all[0],
    ].filter(Boolean),

    /**
     * BREAKING = HIGH INTENSITY NEWS ONLY
     */
    breaking: all.filter(p => (p.score ?? 0) > 80).slice(0, 10),

    /**
     * TRENDING = MID HIGH SIGNAL STORIES
     */
    trending: all.slice(5, 20),

    /**
     * TRANSFER CENTER = CLUSTER LOCKED
     */
    transfers: clusters.transfers?.slice(0, 10) ?? [],

    /**
     * MATCH CENTER = FIXTURES + MATCH CONTENT
     */
    matches: clusters.match?.slice(0, 8) ?? [],

    /**
     * FEATURE GRID = FULL DISCOVERY FEED
     */
    featured: all.slice(0, 24),
  };
}