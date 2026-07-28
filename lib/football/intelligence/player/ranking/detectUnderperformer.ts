// lib/football/intelligence/player/ranking/detectUnderperformer.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import { RANKING_THRESHOLDS } from "./thresholds";

/**
 * Not built on pickTopByScore since this wants the LOWEST rating,
 * not the highest — and only among players who (a) played enough
 * minutes to be fairly judged and (b) actually have a rating, so a
 * benched player or one the provider never rated can't "win" this
 * by default.
 */
export function detectUnderperformer(
  players: PlayerInsight[]
): PlayerInsight | undefined {

  const eligible = players.filter(
    player =>
      player.rating !== undefined &&
      player.minutesPlayed >= RANKING_THRESHOLDS.minMinutesForRecognition
  );

  if (eligible.length === 0) {
    return undefined;
  }

  return eligible.reduce((worst, player) =>
    (player.rating as number) < (worst.rating as number) ? player : worst
  );

}