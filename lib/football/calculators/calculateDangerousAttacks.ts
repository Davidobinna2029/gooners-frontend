// lib/football/calculators/calculateDangerousAttacks.ts

import type { MatchData } from "@/lib/football/data/types";
import { sumTeamStat, hasPlayerData, TeamPair } from "./helpers";

/**
 * APPROXIMATION. "Dangerous attacks" is usually a provider's own
 * event-tagging model (shot quality + build-up speed + proximity
 * to goal), which we don't have access to. This proxies it as
 * shots on target + successful dribbles per team — a reasonable
 * volume-based stand-in for attacking threat, not a real
 * shot-quality or chance-quality metric.
 */
export function calculateDangerousAttacks(data: MatchData): TeamPair {

  if (!hasPlayerData(data)) {
    return { home: 10, away: 10 };
  }

  const home = sumTeamStat(data, "home", player => player.shotsOnTarget + player.dribblesSuccessful);
  const away = sumTeamStat(data, "away", player => player.shotsOnTarget + player.dribblesSuccessful);

  return { home, away };

}