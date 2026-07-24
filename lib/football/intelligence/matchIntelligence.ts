// lib/football/intelligence/matchIntelligence.ts

import type { MatchData } from "@/lib/football/data/types";

/* ==========================================================
   MATCH
========================================================== */

export interface MatchMetadata {
  matchId: number;
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
  id: number;
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
   PLAYER
========================================================== */

export interface PlayerInsight {
  playerId: number;
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
   DEFAULT TEAM METRICS
========================================================== */

function createDefaultTeam(
  id: number,
  name: string,
  shortName?: string,
  formation?: string
): TeamIntelligence {

  return {

    information: {
      id,
      name,
      shortName,
      formation,
    },

    dominance: {
      possessionValue: 50,
      sequenceThreat: 50,
      dangerousAttacks: 10,
      controlIndex: 50,
      fieldTilt: 50,
      tempoIndex: 50,
    },

    progression: {
      attackingWidth: 50,
      ballProgression: 50,
      progressivePasses: 20,
      progressiveCarries: 15,
      carryDistance: 100,
      finalThirdEntries: 15,
      penaltyAreaEntries: 8,
    },

    chanceCreation: {
      xA: 0,
      shotCreatingActions: 0,
      goalCreatingActions: 0,
      keyPassChains: 0,
    },

    defending: {
      defensiveLineHeight: 50,
      pressingIntensity: 50,
      PPDA: 10,
      defensiveCompactness: 50,
      highTurnovers: 0,
      counterPressRecoveries: 0,

      defensiveActionsByThird: {
        defensive: 0,
        middle: 0,
        attacking: 0,
      },
    },

    players: [],
  };

}

/* ==========================================================
   BUILDER
========================================================== */

export function buildMatchIntelligence(
  data: MatchData
): MatchIntelligence {

  return {

    metadata: {
      matchId: data.match.id,
      competition: data.match.competition.name,
      round: data.match.stage,
      venue: data.match.venue,
      kickoff: data.match.utcDate,
    },

    score: {
      home: data.match.score.home,
      away: data.match.score.away,
    },

    home: createDefaultTeam(
      data.match.homeTeam.id,
      data.match.homeTeam.name,
      data.match.homeTeam.shortName,
      data.homeLineup?.formation
    ),

    away: createDefaultTeam(
      data.match.awayTeam.id,
      data.match.awayTeam.name,
      data.match.awayTeam.shortName,
      data.awayLineup?.formation
    ),

    momentum: {
      home: [],
      away: [],
      dominantTeam: "balanced",
    },

  };

}