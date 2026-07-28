// lib/football/intelligence/player/calculatePlayerMinutes.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import type { NormalizedPlayerStats } from "@/lib/football/data/types";

export function calculatePlayerMinutes(
  stats: NormalizedPlayerStats
): Pick<PlayerInsight, "minutesPlayed"> {

  return {
    minutesPlayed: stats.minutesPlayed,
  };

}