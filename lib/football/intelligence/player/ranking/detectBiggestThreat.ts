// lib/football/intelligence/player/ranking/detectBiggestThreat.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import { pickTopByScore } from "./helpers";
import { RANKING_WEIGHTS } from "./thresholds";

export function detectBiggestThreat(
  players: PlayerInsight[]
): PlayerInsight | undefined {

  const w = RANKING_WEIGHTS.biggestThreat;

  return pickTopByScore(
    players,
    player =>
      player.shotsOnTarget * w.shotsOnTarget +
      player.dribblesSuccessful * w.dribblesSuccessful +
      player.goals * w.goals
  );

}