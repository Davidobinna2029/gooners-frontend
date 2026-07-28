// lib/football/calculators/calculateFieldTilt.ts

import type { MatchData } from "@/lib/football/data/types";
import { sumTeamStat, hasPlayerData, round1, TeamPair } from "./helpers";

/**
 * APPROXIMATION. Real "field tilt" is attacking-third touches for
 * one team ÷ combined attacking-third touches for both teams —
 * that needs zone-tagged touch data we don't have from any
 * provider mentioned so far. This proxies it with relative
 * attacking output (shots + shots on target) as a stand-in for
 * "whose end of the pitch the game is being played in." It moves
 * in the same direction as real field tilt but isn't the same
 * measurement.
 */
export function calculateFieldTilt(data: MatchData): TeamPair {

  if (!hasPlayerData(data)) {
    return { home: 50, away: 50 };
  }

  const homeOutput = sumTeamStat(data, "home", player => player.shots + player.shotsOnTarget);
  const awayOutput = sumTeamStat(data, "away", player => player.shots + player.shotsOnTarget);
  const total = homeOutput + awayOutput;

  if (total === 0) {
    return { home: 50, away: 50 };
  }

  const home = round1((homeOutput / total) * 100);

  return { home, away: round1(100 - home) };

}