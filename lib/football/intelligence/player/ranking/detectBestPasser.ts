// lib/football/intelligence/player/ranking/detectBestPasser.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import { pickTopByScore } from "./helpers";
import { RANKING_WEIGHTS } from "./thresholds";

/** Below this many attempted passes, accuracy % is too noisy to be meaningful (3-for-3 isn't a real passing performance). */
const MIN_PASSES_ATTEMPTED = 10;

export function detectBestPasser(
  players: PlayerInsight[]
): PlayerInsight | undefined {

  const w = RANKING_WEIGHTS.bestPasser;

  const eligible = players.filter(
    player => player.passesAttempted >= MIN_PASSES_ATTEMPTED
  );

  return pickTopByScore(
    eligible.length > 0 ? eligible : players,
    player =>
      player.passesCompleted * w.passesCompleted +
      player.passAccuracy * w.passAccuracy +
      player.keyPasses * w.keyPasses
  );

}