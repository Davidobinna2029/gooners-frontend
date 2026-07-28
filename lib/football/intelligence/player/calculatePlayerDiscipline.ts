// lib/football/intelligence/player/calculatePlayerDiscipline.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import type { NormalizedPlayerStats } from "@/lib/football/data/types";

export function calculatePlayerDiscipline(
  stats: NormalizedPlayerStats
): Pick<PlayerInsight, "foulsCommitted" | "foulsDrawn" | "yellowCards" | "redCards"> {

  return {
    foulsCommitted: stats.foulsCommitted,
    foulsDrawn: stats.foulsDrawn,
    yellowCards: stats.yellowCards,
    redCards: stats.redCards,
  };

}