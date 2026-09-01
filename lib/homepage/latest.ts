import type { RankedPost } from "@/lib/engine/ranking";

export function buildLatest(
  ranked: RankedPost[],
  usedPostIds: Set<number> = new Set()
): RankedPost[] {
  const latest: RankedPost[] = [];

  const sorted = [...ranked].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  for (const post of sorted) {
    if (usedPostIds.has(post.id)) {
      continue;
    }

    latest.push(post);

    // Reserve this post so it cannot appear elsewhere
    usedPostIds.add(post.id);

    if (latest.length >= 20) {
      break;
    }
  }

  return latest;
}