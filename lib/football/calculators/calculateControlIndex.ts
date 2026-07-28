// lib/football/calculators/calculateControlIndex.ts

import type { MatchData } from "@/lib/football/data/types";
import { sumTeamStat, hasPlayerData, clamp, round1, TeamPair } from "./helpers";
import { calculatePossession } from "./calculatePossession";

/**
 * COMPOSITE INDEX, not a provider stat — "control" isn't a field
 * any provider exposes anywhere. This blends possession share with
 * relative duel-win dominance into one 0-100 index, similar in
 * spirit to momentumEngine.ts's calculateMomentumScore. Weights are
 * a starting point for tuning, not a validated model.
 */
const CONTROL_WEIGHTS = {
  possession: 0.6,
  duelShare: 0.4,
} as const;

export function calculateControlIndex(data: MatchData): TeamPair {

  if (!hasPlayerData(data)) {
    return { home: 50, away: 50 };
  }

  const homeDuels = sumTeamStat(data, "home", player => player.duelsWon);
  const awayDuels = sumTeamStat(data, "away", player => player.duelsWon);
  const totalDuels = homeDuels + awayDuels;
  const homeDuelShare = totalDuels > 0 ? (homeDuels / totalDuels) * 100 : 50;

  const possession = calculatePossession(data);

  const home = clamp(
    possession.home * CONTROL_WEIGHTS.possession +
    homeDuelShare * CONTROL_WEIGHTS.duelShare
  );

  const rounded = round1(home);

  return { home: rounded, away: round1(100 - rounded) };

}