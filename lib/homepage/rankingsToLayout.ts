import type {
  HomepageRankings,
  HomepageStory,
} from "@/hooks/useHomepageRankings";

import type {
  HomepageLayoutState,
} from "@/components/admin/homepage-editor/context/HomepageEditorContext";

export function rankingsToLayout(
  rankings: HomepageRankings
): HomepageLayoutState {
  const hero: HomepageStory[] = [];

  if (rankings.heroMain) {
    hero.push(rankings.heroMain);
  }

  hero.push(...rankings.heroSide);

  return {
    hero,
    breaking: [...rankings.breaking],
    trending: [...rankings.trending],
    latest: [...rankings.latest],
  };
}