import type { RankedPost } from "@/lib/engine/ranking";

export function buildTrending(
  ranked: RankedPost[],
  usedPostIds: Set<number>
): RankedPost[] {
  const trending: RankedPost[] = [];

  const sorted = [...ranked].sort(
    (a, b) =>
      b.finalScore - a.finalScore
  );

  for (const post of sorted) {
    if (usedPostIds.has(post.id)) {
      continue;
    }

    trending.push(post);

    // Reserve this post
    usedPostIds.add(post.id);

    if (trending.length >= 10) {
      break;
    }
  }

  return trending;
}