import type { CanonicalPost } from "@/types/content";
import { clusterPosts } from "@/lib/engine/clusterPost";

/**
 * =========================
 * TYPE: HOMEPAGE FEED
 * =========================
 */
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
 * STRICT IMAGE FILTER (CORE FIX)
 */
function withImages(posts: CanonicalPost[]) {
  return posts.filter((p) => p.image?.url);
}

/**
 * SORT BY SCORE SAFELY
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
   * HERO (STRICT IMAGE-FIRST)
   * Must ALWAYS have images or it will break UI
   */
  const hero = take(
    sortByScore(
      withImages([
        ...clusters.arsenal,
        ...clusters.match,
      ])
    ),
    5
  );

  /**
   * BREAKING (IMPORTANT NEWS + IMAGE-FIRST)
   */
  const breaking = take(
    sortByScore(
      withImages([
        ...clusters.injury,
        ...clusters.transfers,
      ])
    ),
    8
  );

  /**
   * TRENDING (OPTIONAL IMAGE FILTER — but recommended)
   */
  const trending = take(
    sortByScore(
      withImages(posts).filter(
        (p) => (p.score ?? 0) >= 40
      )
    ),
    10
  );

  /**
   * EDITORS PICKS (HIGH QUALITY ONLY)
   */
  const editors = take(
    sortByScore(
      withImages([
        ...clusters.arsenal,
        ...clusters.match,
      ]).filter((p) => (p.score ?? 0) >= 60)
    ),
    6
  );

  /**
   * TRANSFERS (IMAGE-FIRST)
   */
  const transfer = take(
    sortByScore(withImages(clusters.transfers)),
    8
  );

  /**
   * FEATURED (GLOBAL TOP CONTENT, IMAGE-FIRST)
   */
  const featured = take(
    sortByScore(withImages(posts)),
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