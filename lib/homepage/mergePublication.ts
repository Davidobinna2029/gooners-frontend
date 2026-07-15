import type {
  HomepageLayout,
} from "@/lib/homepage/layout";

export function mergePublication(
  automatic: HomepageLayout,
  published: HomepageLayout | null
): HomepageLayout {
  if (!published) {
    return automatic;
  }

  return {
    ...automatic,

    /**
     * Editorial sections
     */

    heroMain:
      published.heroMain ??
      automatic.heroMain,

    heroSide:
      published.heroSide.length > 0
        ? published.heroSide
        : automatic.heroSide,

    breaking:
      published.breaking.length > 0
        ? published.breaking
        : automatic.breaking,

    /**
     * Automatic sections
     */

    latest: automatic.latest,

    trending: automatic.trending,

    all: automatic.all,
  };
}