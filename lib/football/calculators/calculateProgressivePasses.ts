// lib/football/calculators/calculateProgressivePasses.ts

import type { MatchData } from "@/lib/football/data/types";
import { sumTeamStat, hasPlayerData, TeamPair } from "./helpers";

/**
 * NOT a real progressive-pass count. A genuine progressive pass is
 * defined by how far the ball moved upfield — that needs pass
 * origin/destination coordinates, the same wall that ruled out xG,
 * xA, and per-player progression metrics elsewhere in this
 * codebase (see PlayerInsight's capability-flag discussion). This
 * uses total completed passes as a volume proxy for "ball
 * progression activity" until a coordinate-tracking provider is
 * available. Treat this as directional/relative between the two
 * teams, not a literal count of progressive passes.
 */
export function calculateProgressivePasses(data: MatchData): TeamPair {

  if (!hasPlayerData(data)) {
    return { home: 20, away: 20 };
  }

  // NormalizedPlayerStats carries attempted passes + an accuracy
  // percentage, not a completed count directly — derive it the
  // same way calculatePlayerPassing.ts does at the player level.
  const home = sumTeamStat(
    data,
    "home",
    player => Math.round(player.passesAttempted * (player.passAccuracy / 100))
  );

  const away = sumTeamStat(
    data,
    "away",
    player => Math.round(player.passesAttempted * (player.passAccuracy / 100))
  );

  return { home, away };

}