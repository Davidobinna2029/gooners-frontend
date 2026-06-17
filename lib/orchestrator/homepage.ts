import type { CanonicalPost } from "@/types/content";
import { clusterPosts } from "@/lib/engine/clusterPost";

export interface HomepageFeed {
  hero: CanonicalPost[];
  breaking: CanonicalPost[];
  trending: CanonicalPost[];
  editors: CanonicalPost[];
  transfer: CanonicalPost[];
  featured: CanonicalPost[];
}

/**
 * =========================
 * HELPERS
 * =========================
 */

function take(posts: CanonicalPost[], n: number) {
  return posts.slice(0, n);
}

/**
 * IMAGE-VALID POSTS ONLY
 */
function withImages(posts: CanonicalPost[]) {
  return posts.filter((p) => Boolean(p.image?.url));
}

/**
 * GLOBAL DEDUP (CRITICAL FIX)
 */
function uniqueById(posts: CanonicalPost[]) {
  const seen = new Set<number>();

  return posts.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

/**
 * SORT BY SCORE
 */
function sortByScore(posts: CanonicalPost[]) {
  return [...posts].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0)
  );
}

/**
 * =========================
 * MAIN ORCHESTRATOR
 * =========================
 */
export function buildHomepageFeed(posts: CanonicalPost[]): HomepageFeed {
  const clusters = clusterPosts(posts);

  /**
   * PREP BASE POOLS (DEDUPED ONCE)
   */
  const arsenal = uniqueById(withImages(clusters.arsenal));
  const match = uniqueById(withImages(clusters.match));
  const transfers = uniqueById(withImages(clusters.transfers));
  const injury = uniqueById(withImages(clusters.injury));

  const all = uniqueById(withImages(posts));

  /**
   * HERO (TOP PRIORITY CONTENT)
   */
  const hero = take(
    sortByScore([...arsenal, ...match]),
    5
  );

  /**
   * BREAKING
   */
  const breaking = take(
    sortByScore([...injury, ...transfers]),
    8
  );

  /**
   * TRENDING
   */
  const trending = take(
    sortByScore(all.filter((p) => (p.score ?? 0) >= 40)),
    10
  );

  /**
   * EDITORS PICKS
   */
  const editors = take(
    sortByScore(
      all.filter((p) => (p.score ?? 0) >= 60)
    ),
    6
  );

  /**
   * TRANSFERS
   */
  const transfer = take(
    sortByScore(transfers),
    8
  );

  /**
   * FEATURED (GLOBAL UNIQUE POOL ONLY)
   */
  const featured = take(
    sortByScore(all),
    18
  );

  return {
    hero,
    breaking,
    trending,
    editors,
    transfer,
    featured,
  };
}