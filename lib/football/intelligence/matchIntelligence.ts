// lib/football/intelligence/matchIntelligence.ts

import type { MatchData } from "@/lib/football/data/types";

import { buildPlayerIntelligence } from "@/lib/football/intelligence/player/buildPlayerIntelligence";

import {
  calculatePossession,
  calculateControlIndex,
  calculateFieldTilt,
  calculatePPDA,
  calculateProgressivePasses,
  calculateDangerousAttacks,
} from "@/lib/football/calculators";

/* ==========================================================
   PROVIDER CONFIDENCE
   Rough reliability score per data provider, used to flag
   how much an AI engine downstream should trust this payload.
========================================================== */

const PROVIDER_CONFIDENCE: Record<string, number> = {
  "football-data.org": 0.95,
  "api-football": 0.99,
  mock: 0.4,
};

const DEFAULT_CONFIDENCE = 0.9;

const MATCH_INTELLIGENCE_VERSION = "1.0.0";

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
  crest?: string;
  country?: string;
  code?: string;
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
  xA?: number;
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
  team: "home" | "away";

  shirtNumber?: number;
  position?: string;

  /**
   * 0-10. Undefined (not 0) when the provider has no rating for
   * this player — e.g. an unused substitute — since 0 would read
   * as "rated zero" rather than "not rated."
   */
  rating?: number;

  minutesPlayed: number;

  goals: number;
  assists: number;

  shots: number;
  shotsOnTarget: number;

  keyPasses: number;
  passesAttempted: number;
  passesCompleted: number;
  /** 0-100. Derived from passesAttempted × passAccuracy, not a literal provider field — see calculatePlayerPassing.ts. */
  passAccuracy: number;

  tackles: number;
  interceptions: number;
  duelsWon: number;
  duelsTotal: number;
  dribblesSuccessful: number;

  foulsCommitted: number;
  foulsDrawn: number;

  yellowCards: number;
  redCards: number;

  /**
   * Derived composite score (see calculatePlayerContribution.ts),
   * not a provider stat — used for ranking players against each
   * other, not displayed as if it were a measured metric.
   */
  contributionScore: number;
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

  generatedAt: string;

  updatedAt: string;

  provider: string;

  confidence: number;

  version: string;

  score: MatchScore;

  home: TeamIntelligence;

  away: TeamIntelligence;

  momentum?: MomentumMetrics;
}

/* ==========================================================
   DEFAULT TEAM METRICS
========================================================== */

interface TeamMetricOverrides {
  dominance?: Partial<DominanceMetrics>;
  progression?: Partial<ProgressionMetrics>;
  chanceCreation?: Partial<ChanceCreationMetrics>;
  defending?: Partial<DefensiveMetrics>;
  players?: PlayerInsight[];
}

function createDefaultTeam(
  id: number,
  name: string,
  shortName?: string,
  formation?: string,
  metrics?: TeamMetricOverrides
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
      ...(metrics?.dominance ?? {}),
    },

    progression: {
      attackingWidth: 50,
      ballProgression: 50,
      progressivePasses: 20,
      progressiveCarries: 15,
      carryDistance: 100,
      finalThirdEntries: 15,
      penaltyAreaEntries: 8,
      ...(metrics?.progression ?? {}),
    },

    chanceCreation: {
      shotCreatingActions: 0,
      goalCreatingActions: 0,
      keyPassChains: 0,
      ...(metrics?.chanceCreation ?? {}),
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
      ...(metrics?.defending ?? {}),
    },

    players: metrics?.players ?? [],
  };

}

/* ==========================================================
   BUILDER
========================================================== */

export function buildMatchIntelligence(
  data: MatchData
): MatchIntelligence {

  const provider =
    process.env.NEXT_PUBLIC_FOOTBALL_PROVIDER ?? "football-data.org";

  const confidence =
    PROVIDER_CONFIDENCE[provider] ?? DEFAULT_CONFIDENCE;

  const timestamp = new Date().toISOString();

  const metrics = {
    possession: calculatePossession(data),
    controlIndex: calculateControlIndex(data),
    fieldTilt: calculateFieldTilt(data),
    ppda: calculatePPDA(data),
    progressivePasses: calculateProgressivePasses(data),
    dangerousAttacks: calculateDangerousAttacks(data),
  };


  const homePlayers = buildPlayerIntelligence(
    (data.players ?? []).filter(player => player.team === "home")
  );

  const awayPlayers = buildPlayerIntelligence(
    (data.players ?? []).filter(player => player.team === "away")
  );

  return {

    metadata: {
      matchId: data.match.id,
      competition: data.match.competition.name,
      round: data.match.stage,
      venue: data.match.venue,
      kickoff: data.match.utcDate,
    },

    generatedAt: timestamp,

    updatedAt: timestamp,

    provider,

    confidence,

    version: MATCH_INTELLIGENCE_VERSION,

    score: {
      home: data.match.score.home,
      away: data.match.score.away,
    },

    home: createDefaultTeam(
      data.match.homeTeam.id,
      data.match.homeTeam.name,
      data.match.homeTeam.shortName,
      data.homeLineup?.formation,
      {
        dominance: {
          possessionValue: metrics.possession.home,
          controlIndex: metrics.controlIndex.home,
          fieldTilt: metrics.fieldTilt.home,
          dangerousAttacks: metrics.dangerousAttacks.home,
        },

        progression: {
          progressivePasses: metrics.progressivePasses.home,
        },

        defending: {
          PPDA: metrics.ppda.home,
        },

        players: homePlayers,
      }
    ),

    away: createDefaultTeam(
      data.match.awayTeam.id,
      data.match.awayTeam.name,
      data.match.awayTeam.shortName,
      data.awayLineup?.formation,
      {
        dominance: {
          possessionValue: metrics.possession.away,
          controlIndex: metrics.controlIndex.away,
          fieldTilt: metrics.fieldTilt.away,
          dangerousAttacks: metrics.dangerousAttacks.away,
        },

        progression: {
          progressivePasses: metrics.progressivePasses.away,
        },

        defending: {
          PPDA: metrics.ppda.away,
        },

        players: awayPlayers,
      }
    ),

    momentum: {
      home: [],
      away: [],
      dominantTeam: "balanced",
    },

  };

}