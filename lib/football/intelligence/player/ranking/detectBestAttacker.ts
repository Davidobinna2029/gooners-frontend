// lib/football/intelligence/player/ranking/detectBestAttacker.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import { pickTopByScore } from "./helpers";
import { RANKING_WEIGHTS } from "./thresholds";

export function detectBestAttacker(
  players: PlayerInsight[]
): PlayerInsight | undefined {

  const w = RANKING_WEIGHTS.bestAttacker;

  return pickTopByScore(
    players,
    player =>
      player.goals * w.goals +
      player.shots * w.shots +
      player.shotsOnTarget * w.shotsOnTarget
  );

}