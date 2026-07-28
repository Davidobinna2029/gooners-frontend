// lib/football/intelligence/player/calculatePlayerPassing.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import type { NormalizedPlayerStats } from "@/lib/football/data/types";

export function calculatePlayerPassing(
  stats: NormalizedPlayerStats
): Pick<
  PlayerInsight,
  | "assists"
  | "keyPasses"
  | "passesAttempted"
  | "passesCompleted"
  | "passAccuracy"
  | "dribblesSuccessful"
> {

  // NormalizedPlayerStats carries attempted passes + an accuracy
  // percentage, not a literal "completed" count — this derives it
  // (rounded) rather than pretending the provider reports it
  // directly.
  const passesCompleted = Math.round(
    stats.passesAttempted * (stats.passAccuracy / 100)
  );

  return {
    assists: stats.assists,
    keyPasses: stats.keyPasses,
    passesAttempted: stats.passesAttempted,
    passesCompleted,
    passAccuracy: stats.passAccuracy,
    // Dribbles live here rather than in defending/shooting: they're
    // on-ball creative involvement, the closest real substitute for
    // "progression" until a tracking-data provider adds real
    // progressive-carry metrics.
    dribblesSuccessful: stats.dribblesSuccessful,
  };

}