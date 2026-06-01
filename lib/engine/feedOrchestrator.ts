import type { CanonicalPost } from "./ingestPosts";
import { rankForDiscover } from "./scoreEngine";
import { clusterPosts } from "./clusterEngine";

export function buildHomepageFeed(posts: CanonicalPost[]) {
  const ranked = rankForDiscover(posts);
  const clusters = clusterPosts(ranked);

  return {
    hero: ranked.slice(0, 5),
    breaking: ranked.filter(p => p.score > 85).slice(0, 6),
    trending: ranked.slice(5, 15),

    arsenal: clusters.arsenal.slice(0, 10),
    transfers: clusters.transfer.slice(0, 10),
    injuries: clusters.injury.slice(0, 8),
    matches: clusters.match.slice(0, 8),

    discover: ranked.slice(0, 20),
  };
}