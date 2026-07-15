import type { RankedPost } from "@/lib/engine/ranking";

interface Override {
  postId: number;
  type: string;
}

export function buildBreaking(
  ranked: RankedPost[],
  overrides: Override[]
): RankedPost[] {
  return ranked
    .filter(
      (post) =>
        post.flags?.breaking === true ||
        overrides.some(
          (override) =>
            override.postId === post.id &&
            override.type === "FORCE_BREAKING"
        )
    )
    .slice(0, 10);
}