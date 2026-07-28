// lib/football/intelligence/player/ranking/helpers.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";

/**
 * Returns the highest-scoring player, or undefined for an empty
 * pool. Centralized so every detector shares identical tie-break
 * behavior (first player wins ties) instead of each reimplementing
 * its own sort.
 */
export function pickTopByScore(
  players: PlayerInsight[],
  score: (player: PlayerInsight) => number
): PlayerInsight | undefined {

  let best: PlayerInsight | undefined;
  let bestScore = -Infinity;

  for (const player of players) {

    const value = score(player);

    if (value > bestScore) {
      best = player;
      bestScore = value;
    }

  }

  return best;

}