// lib/football/calculators/calculatePossession.ts

import type { MatchData } from "@/lib/football/data/types";
import { sumTeamStat, hasPlayerData, round1, TeamPair } from "./helpers";

/**
 * APPROXIMATION, not a literal possession stat. Providers rarely
 * expose a real touch-time-based possession % outside a dedicated
 * statistics endpoint (API-Football's /fixtures/statistics does,
 * but that's a separate endpoint from per-player data this
 * calculator has access to). This estimates possession share from
 * each team's total attempted passes — pass volume correlates
 * strongly with time on the ball, but this is not the same as
 * tracked touch time.
 *
 * Falls back to an even 50/50 split when no per-player data is
 * available yet (e.g. before provider migration wiring populates
 * MatchData.players).
 */
export function calculatePossession(data: MatchData): TeamPair {

  if (!hasPlayerData(data)) {
    return { home: 50, away: 50 };
  }

  const homePasses = sumTeamStat(data, "home", player => player.passesAttempted);
  const awayPasses = sumTeamStat(data, "away", player => player.passesAttempted);
  const total = homePasses + awayPasses;

  if (total === 0) {
    return { home: 50, away: 50 };
  }

  const home = round1((homePasses / total) * 100);

  return { home, away: round1(100 - home) };

}