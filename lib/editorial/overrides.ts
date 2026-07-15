import { prisma } from "@/lib/db/prisma";
import type { CanonicalPost } from "@/types/content";

export type OverrideType =
  | "PIN_TO_HERO"
  | "HERO_POSITION"
  | "FORCE_BREAKING"
  | "BOOST_SCORE"
  | "BLOCK_POST"
  | "HIDE_POST";

export type PostLike =
  CanonicalPost & {
    score?: number;
    _pinHero?: boolean;
    _breaking?: boolean;
    _heroPosition?: number | null;
    _remove?: boolean;
  };

/**
 * CREATE OVERRIDE
 */
export async function createOverride(
  postId: number,
  type: OverrideType,
  createdBy: string,
  reason?: string,
  value?: number
) {
  return prisma.override.create({
    data: {
      postId,
      type,
      createdBy,
      reason,
      value: value ?? null,
    },
  });
}

/**
 * ACTIVE OVERRIDES
 */
export async function getActiveOverrides(
  postId?: number
) {
  return prisma.override.findMany({
    where: {
      ...(postId
        ? { postId }
        : {}),
      OR: [
        {
          expiresAt: null,
        },
        {
          expiresAt: {
            gt: new Date(),
          },
        },
      ],
    },
  });
}

/**
 * APPLY OVERRIDES
 */
export function applyOverrides(
  posts: CanonicalPost[],
  overrides: any[]
): PostLike[] {
  const map =
    new Map<number, any[]>();

  for (const ov of overrides) {
    if (
      !map.has(ov.postId)
    ) {
      map.set(
        ov.postId,
        []
      );
    }

    map
      .get(ov.postId)!
      .push(ov);
  }

  const result: PostLike[] =
    posts.map((post) => ({
      ...post,
    }));

  for (const post of result) {
    const postOverrides =
      map.get(post.id);

    if (!postOverrides)
      continue;

    for (const ov of postOverrides) {
      switch (ov.type) {
        case "HIDE_POST":
        case "BLOCK_POST":
          post._remove = true;
          break;

        case "PIN_TO_HERO":
          post.score =
            (post.score ??
              0) + 1000;

          post._pinHero =
            true;
          break;

        case "HERO_POSITION":
          post.score =
            (post.score ??
              0) + 2000;

          post._heroPosition =
            ov.value ?? null;
          break;

        case "FORCE_BREAKING":
          post.score =
            (post.score ??
              0) + 500;

          post._breaking =
            true;
          break;

        case "BOOST_SCORE":
          post.score =
            (post.score ??
              0) +
            (ov.value ??
              10);
          break;
      }
    }
  }

  return result.filter(
    (post) => !post._remove
  );
}