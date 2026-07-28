// lib/football/intelligence/player/ranking/detectManOfTheMatch.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import { pickTopByScore } from "./helpers";
import { RANKING_THRESHOLDS } from "./thresholds";

/**
 * Prefers real provider ratings. Only falls back to
 * contributionScore (a derived heuristic, not a provider stat) if
 * literally no eligible player has a rating.
 *
 * Requires a minimum minutes played — otherwise a substitute who
 * scored a stoppage-time winner in 10 minutes and got an inflated
 * rating for it would beat a genuine 90-minute best-on-pitch
 * performance. Falls back to the full pool only if nobody clears
 * the threshold (e.g. a match decided almost entirely by
 * substitutes).
 */
export function detectManOfTheMatch(
  players: PlayerInsight[]
): PlayerInsight | undefined {

  const eligible = players.filter(
    player => player.minutesPlayed >= RANKING_THRESHOLDS.minMinutesForRecognition
  );

  const pool = eligible.length > 0 ? eligible : players;

  const hasAnyRating = pool.some(player => player.rating !== undefined);

  if (hasAnyRating) {
    return pickTopByScore(pool, player => player.rating ?? -Infinity);
  }

  return pickTopByScore(pool, player => player.contributionScore);

}