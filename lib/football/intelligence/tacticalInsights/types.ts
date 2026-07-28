// lib/football/intelligence/tacticalInsights/types.ts

import type { TeamIntelligence } from "../matchIntelligence";

export type TacticalCategory =
  | "attack"
  | "defence"
  | "transition"
  | "pressing"
  | "shape"
  | "possession";

export interface TacticalInsight {
  id: string;
  title: string;
  description: string;
  category: TacticalCategory;
  /** 0.0 → 1.0 */
  confidence: number;
  evidence: string[];
}

export interface TacticalInsights {
  attacking: TacticalInsight[];
  defending: TacticalInsight[];
  transition: TacticalInsight[];
  possession: TacticalInsight[];
}

export interface MatchTacticalInsights {
  generatedAt: string;
  version: string;
  home: TacticalInsights;
  away: TacticalInsights;
}

export type Side = "home" | "away";

/**
 * What every detector receives. `self` is the team being evaluated,
 * `opponent` is there for patterns that are inherently relative
 * (e.g. a weakness defined by what the opponent exploited).
 */
export interface DetectorContext {
  side: Side;
  self: TeamIntelligence;
  opponent: TeamIntelligence;
}