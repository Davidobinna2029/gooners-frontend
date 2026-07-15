import type { RankedPost } from "@/lib/engine/ranking";

export interface HomepageLayout {
  heroMain: RankedPost | null;
  heroSide: RankedPost[];

  breaking: RankedPost[];

  latest: RankedPost[];

  trending: RankedPost[];

  all: RankedPost[];
}

export function buildHomepageLayout(params: {
  hero: RankedPost[];
  breaking: RankedPost[];
  latest: RankedPost[];
  trending: RankedPost[];
  all: RankedPost[];
}): HomepageLayout {
  const {
    hero,
    breaking,
    latest,
    trending,
    all,
  } = params;

  return {
    heroMain:
      hero.length > 0
        ? hero[0]
        : null,

    heroSide:
      hero.slice(1, 4),

    breaking,

    latest,

    trending,

    all,
  };
}