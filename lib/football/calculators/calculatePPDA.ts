// lib/football/calculators/calculatePPDA.ts

import type { MatchData } from "@/lib/football/data/types";
import { sumTeamStat, hasPlayerData, round1, TeamPair } from "./helpers";

/**
 * APPROXIMATION. Real PPDA (passes allowed per defensive action)
 * restricts both the opponent's passes and this team's defensive
 * actions to a specific zone (usually the defensive 60-40% of the
 * pitch) — that needs zone-tagged event data we don't have. This
 * computes a whole-match version instead: opponent's total
 * attempted passes ÷ this team's (tackles + interceptions). Lower
 * still means more aggressive pressing, same direction as real
 * PPDA, just measured across the whole match rather than a zone.
 */
export function calculatePPDA(data: MatchData): TeamPair {

  if (!hasPlayerData(data)) {
    return { home: 10, away: 10 };
  }

  const homeDefensiveActions = sumTeamStat(data, "home", player => player.tackles + player.interceptions);
  const awayDefensiveActions = sumTeamStat(data, "away", player => player.tackles + player.interceptions);
  const homePasses = sumTeamStat(data, "home", player => player.passesAttempted);
  const awayPasses = sumTeamStat(data, "away", player => player.passesAttempted);

  const home = homeDefensiveActions > 0 ? round1(awayPasses / homeDefensiveActions) : 10;
  const away = awayDefensiveActions > 0 ? round1(homePasses / awayDefensiveActions) : 10;

  return { home, away };

}