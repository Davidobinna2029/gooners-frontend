// lib/football/intelligence/player/ranking/playerRankingEngine.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import type { PlayerRankings } from "./types";

import { detectManOfTheMatch } from "./detectManOfTheMatch";
import { detectBestAttacker } from "./detectBestAttacker";
import { detectBestCreator } from "./detectBestCreator";
import { detectBestDefender } from "./detectBestDefender";
import { detectBestPasser } from "./detectBestPasser";
import { detectBiggestThreat } from "./detectBiggestThreat";
import { detectUnderperformer } from "./detectUnderperformer";
import { detectSurprisePerformer } from "./detectSurprisePerformer";

/**
 * Rankings span both teams — Man of the Match, Best Defender, etc.
 * are match-wide superlatives, not per-team ones. Pass the
 * combined home + away player pool.
 */
export function buildPlayerRankings(
  players: PlayerInsight[]
): PlayerRankings {

  const manOfTheMatch = detectManOfTheMatch(players);

  return {
    manOfTheMatch,
    bestAttacker: detectBestAttacker(players),
    bestCreator: detectBestCreator(players),
    bestDefender: detectBestDefender(players),
    bestPasser: detectBestPasser(players),
    biggestThreat: detectBiggestThreat(players),
    underperformer: detectUnderperformer(players),
    surprisePerformer: detectSurprisePerformer(players, manOfTheMatch),
  };

}