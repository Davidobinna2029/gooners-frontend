// lib/football/intelligence/player/calculatePlayerDefending.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import type { NormalizedPlayerStats } from "@/lib/football/data/types";

export function calculatePlayerDefending(
  stats: NormalizedPlayerStats
): Pick<PlayerInsight, "tackles" | "interceptions" | "duelsWon" | "duelsTotal"> {

  return {
    tackles: stats.tackles,
    interceptions: stats.interceptions,
    duelsWon: stats.duelsWon,
    duelsTotal: stats.duelsTotal,
  };

}