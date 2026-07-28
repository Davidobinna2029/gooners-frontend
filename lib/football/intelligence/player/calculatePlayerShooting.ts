// lib/football/intelligence/player/calculatePlayerShooting.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import type { NormalizedPlayerStats } from "@/lib/football/data/types";

export function calculatePlayerShooting(
  stats: NormalizedPlayerStats
): Pick<PlayerInsight, "goals" | "shots" | "shotsOnTarget"> {

  return {
    goals: stats.goals,
    shots: stats.shots,
    shotsOnTarget: stats.shotsOnTarget,
  };

}