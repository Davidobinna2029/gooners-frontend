// lib/football/intelligence/player/ranking/detectBestDefender.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import { pickTopByScore } from "./helpers";
import { RANKING_WEIGHTS } from "./thresholds";

export function detectBestDefender(
  players: PlayerInsight[]
): PlayerInsight | undefined {

  const w = RANKING_WEIGHTS.bestDefender;

  return pickTopByScore(
    players,
    player =>
      player.tackles * w.tackles +
      player.interceptions * w.interceptions +
      player.duelsWon * w.duelsWon
  );

}