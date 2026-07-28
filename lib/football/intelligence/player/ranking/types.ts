// lib/football/intelligence/player/ranking/types.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";

/**
 * Built directly on PlayerInsight (the existing, already-wired
 * per-player model) rather than a parallel PlayerIntelligence
 * type, to avoid two overlapping models of the same data.
 */
export interface PlayerRankings {
  manOfTheMatch?: PlayerInsight;
  bestAttacker?: PlayerInsight;
  bestCreator?: PlayerInsight;
  bestDefender?: PlayerInsight;
  bestPasser?: PlayerInsight;
  biggestThreat?: PlayerInsight;
  surprisePerformer?: PlayerInsight;
  underperformer?: PlayerInsight;
}