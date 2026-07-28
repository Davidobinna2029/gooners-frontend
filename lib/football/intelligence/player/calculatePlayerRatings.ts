// lib/football/intelligence/player/calculatePlayerRatings.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import type { NormalizedPlayerStats } from "@/lib/football/data/types";

export function calculatePlayerRatings(
  stats: NormalizedPlayerStats
): Pick<PlayerInsight, "rating"> {

  return {
    rating: stats.rating,
  };

}