// src/lib/football/intelligence/matchIntelligence.ts

import type { ID } from "@/src/lib/football/types";

/* ==========================================================
   MATCH
========================================================== */

export interface MatchMetadata {
  matchId: ID;
  competition?: string;
  season?: string;
  round?: string;

  venue?: string;

  kickoff?: string;

  referee?: string;
}

/* ==========================================================
   SCORE
========================================================== */

export interface MatchScore {
  home: number;
  away: number;
}

/* ==========================================================
   TEAM
========================================================== */

export interface TeamInformation {
  id: ID;

  name: string;

  shortName?: string;

  formation?: string;

  manager?: string;
}

/* ==========================================================
   DOMINANCE
========================================================== */

export interface DominanceMetrics {
  possessionValue: number;

  sequenceThreat: number;

  dangerousAttacks: number;

  controlIndex: number;

  fieldTilt: number;

  tempoIndex: number;
}

/* ==========================================================
   BALL PROGRESSION
========================================================== */

export interface ProgressionMetrics {
  attackingWidth: number;

  ballProgression: number;

  progressivePasses: number;

  progressiveCarries: number;

  carryDistance: number;

  finalThirdEntries: number;

  penaltyAreaEntries: number;
}

/* ==========================================================
   CHANCE CREATION
========================================================== */

export interface ChanceCreationMetrics {
  xA: number;

  shotCreatingActions: number;

  goalCreatingActions: number;

  keyPassChains: number;
}

/* ==========================================================
   DEFENDING
========================================================== */

export interface DefensiveMetrics {
  defensiveLineHeight: number;

  pressingIntensity: number;

  PPDA: number;

  defensiveCompactness: number;

  highTurnovers: number;

  counterPressRecoveries: number;

  defensiveActionsByThird: {
    defensive: number;
    middle: number;
    attacking: number;
  };
}

/* ==========================================================
   MOMENTUM
========================================================== */

export interface MomentumMetrics {
  home: number[];

  away: number[];

  dominantTeam?:
    | "home"
    | "away"
    | "balanced";
}

/* ==========================================================
   PLAYER INSIGHTS
========================================================== */

export interface PlayerInsight {
  playerId: ID;

  playerName: string;

  rating?: number;

  xG?: number;

  xA?: number;

  progressivePasses?: number;

  progressiveCarries?: number;

  defensiveActions?: number;
}

/* ==========================================================
   TEAM INTELLIGENCE
========================================================== */

export interface TeamIntelligence {
  information: TeamInformation;

  dominance: DominanceMetrics;

  progression: ProgressionMetrics;

  chanceCreation: ChanceCreationMetrics;

  defending: DefensiveMetrics;

  players: PlayerInsight[];
}

/* ==========================================================
   MATCH INTELLIGENCE
========================================================== */

export interface MatchIntelligence {
  metadata: MatchMetadata;

  score: MatchScore;

  home: TeamIntelligence;

  away: TeamIntelligence;

  momentum?: MomentumMetrics;
}

/* ==========================================================
   BUILDER
========================================================== */

export function buildMatchIntelligence(
  intelligence: MatchIntelligence
): MatchIntelligence {
  return intelligence;
}