// lib/football/intelligence/player/ranking/detectSurprisePerformer.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import { pickTopByScore } from "./helpers";

/**
 * "Surprise" properly means "better than expected" — which needs
 * data this pipeline doesn't have (starting-XI status, market
 * value, reputation, historical form). Rather than inventing that,
 * this is an honest, narrower proxy: the strongest all-round
 * performance (by contributionScore) besides whoever's already
 * Man of the Match. It'll sometimes just be "the second-best
 * player," not a genuine surprise — label any UI/copy built on
 * this accordingly.
 */
export function detectSurprisePerformer(
  players: PlayerInsight[],
  manOfTheMatch: PlayerInsight | undefined
): PlayerInsight | undefined {

  const remaining = manOfTheMatch
    ? players.filter(player => player.playerId !== manOfTheMatch.playerId)
    : players;

  return pickTopByScore(remaining, player => player.contributionScore);

}