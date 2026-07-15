import type { RankedPost } from "@/lib/engine/ranking";

export function buildLatest(
  ranked: RankedPost[]
): RankedPost[] {
  return [...ranked]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 20);
}