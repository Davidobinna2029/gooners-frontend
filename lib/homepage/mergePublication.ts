import type {
  HomepageLayout,
} from "@/lib/homepage/layout";

function uniquePosts<T extends { id: number }>(
  posts: T[],
  usedIds: Set<number>
): T[] {
  const result: T[] = [];

  for (const post of posts) {
    if (usedIds.has(post.id)) {
      continue;
    }

    result.push(post);
    usedIds.add(post.id);
  }

  return result;
}

export function mergePublication(
  automatic: HomepageLayout,
  published: HomepageLayout | null
): HomepageLayout {
  if (!published) {
    return automatic;
  }

  // =======================================================
  // GLOBAL DEDUPLICATION
  // =======================================================

  const usedIds =
    new Set<number>();

  // -------------------------------------------------------
  // HERO
  // -------------------------------------------------------

  const heroMain =
    published.heroMain ??
    automatic.heroMain;

  if (heroMain) {
    usedIds.add(heroMain.id);
  }

  const heroSide =
    uniquePosts(
      published.heroSide.length > 0
        ? published.heroSide
        : automatic.heroSide,
      usedIds
    );

  // -------------------------------------------------------
  // BREAKING
  // -------------------------------------------------------

  const breaking =
    uniquePosts(
      published.breaking.length > 0
        ? published.breaking
        : automatic.breaking,
      usedIds
    );

  // -------------------------------------------------------
  // LATEST
  // -------------------------------------------------------

  const latest =
    uniquePosts(
      automatic.latest,
      usedIds
    );

  // -------------------------------------------------------
  // TRENDING
  // -------------------------------------------------------

  const trending =
    uniquePosts(
      automatic.trending,
      usedIds
    );

  // =======================================================
  // RETURN FINAL HOMEPAGE
  // =======================================================

  return {
    heroMain,
    heroSide,

    breaking,

    latest,

    trending,

    all: automatic.all,
  };
}