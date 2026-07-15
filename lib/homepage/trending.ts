import type { RankedPost } from "@/lib/engine/ranking";

export function buildTrending(
  ranked: RankedPost[],
  usedPostIds: Set<number>
): RankedPost[] {
  return [...ranked]
    .filter(
      (post) => !usedPostIds.has(post.id)
    )
    .sort(
      (a, b) =>
        b.finalScore - a.finalScore
    )
    .slice(0, 10);
}