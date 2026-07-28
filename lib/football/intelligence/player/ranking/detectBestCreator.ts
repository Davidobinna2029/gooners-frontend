// lib/football/intelligence/player/ranking/detectBestCreator.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import { pickTopByScore } from "./helpers";
import { RANKING_WEIGHTS } from "./thresholds";

export function detectBestCreator(
  players: PlayerInsight[]
): PlayerInsight | undefined {

  const w = RANKING_WEIGHTS.bestCreator;

  return pickTopByScore(
    players,
    player => player.assists * w.assists + player.keyPasses * w.keyPasses
  );

}