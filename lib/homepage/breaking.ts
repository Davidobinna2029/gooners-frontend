import type { RankedPost } from "@/lib/engine/ranking";

interface Override {
  postId: number;
  type: string;
}

export function buildBreaking(
  ranked: RankedPost[],
  overrides: Override[],
  usedPostIds: Set<number> = new Set()
): RankedPost[] {
  const breaking: RankedPost[] = [];

  for (const post of ranked) {
    // Never duplicate a post already used elsewhere
    if (usedPostIds.has(post.id)) {
      continue;
    }

    const isBreaking =
      post.flags?.breaking === true ||
      overrides.some(
        (override) =>
          override.postId === post.id &&
          override.type === "FORCE_BREAKING"
      );

    if (!isBreaking) {
      continue;
    }

    breaking.push(post);

    // Reserve this post
    usedPostIds.add(post.id);

    if (breaking.length >= 10) {
      break;
    }
  }

  return breaking;
}