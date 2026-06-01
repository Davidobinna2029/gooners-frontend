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
 * HELPER: SAFE SLICE
 * =========================
 */
function take(posts: CanonicalPost[], n: number) {
  return posts.slice(0, n);
}

/**
 * =========================
 * MAIN ORCHESTRATOR
 * =========================
 */
export function buildHomepageFeed(posts: CanonicalPost[]): HomepageFeed {
  const clusters = clusterPosts(posts);

  const hero = take(
    [...clusters.arsenal, ...clusters.match].sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0)
    ),
    5
  );

  const breaking = take(
    [...clusters.injury, ...clusters.transfers].sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0)
    ),
    8
  );

  const trending = take(
    [...posts]
      .filter((p) => (p.score ?? 0) >= 40)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    10
  );

  const editors = take(
    [...clusters.arsenal, ...clusters.match]
      .filter((p) => (p.score ?? 0) >= 60)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    6
  );

  const transfer = take(
    clusters.transfers.sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0)
    ),
    8
  );

  const featured = take(
    [...posts].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
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