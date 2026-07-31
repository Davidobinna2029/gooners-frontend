import type {
  MatchIntelligence,
} from "@/lib/football/intelligence/matchIntelligence";

import type {
  TacticalInsight,
} from "@/lib/football/intelligence/tacticalInsightsEngine";

export interface MatchIntelligenceDashboardViewModel {
  possession: {
    home: number;
    away: number;
  };

  controlIndex: {
    home: number;
    away: number;
  };

  fieldTilt: {
    home: number;
    away: number;
  };

  dangerousAttacks: {
    home: number;
    away: number;
  };

  progressivePasses: {
    home: number;
    away: number;
  };

  PPDA: {
    home: number;
    away: number;
  };

  tacticalInsights: TacticalInsight[];
}

export function mapMatchIntelligenceDashboard(
  intelligence: MatchIntelligence,
  tacticalInsights: TacticalInsight[]
): MatchIntelligenceDashboardViewModel {
  return {
    possession: {
      home:
        intelligence.home.dominance.possessionValue,
      away:
        intelligence.away.dominance.possessionValue,
    },

    controlIndex: {
      home:
        intelligence.home.dominance.controlIndex,
      away:
        intelligence.away.dominance.controlIndex,
    },

    fieldTilt: {
      home:
        intelligence.home.dominance.fieldTilt,
      away:
        intelligence.away.dominance.fieldTilt,
    },

    dangerousAttacks: {
      home:
        intelligence.home.dominance.dangerousAttacks,
      away:
        intelligence.away.dominance.dangerousAttacks,
    },

    progressivePasses: {
      home:
        intelligence.home.progression.progressivePasses,
      away:
        intelligence.away.progression.progressivePasses,
    },

    PPDA: {
      home:
        intelligence.home.defending.PPDA,
      away:
        intelligence.away.defending.PPDA,
    },

    tacticalInsights,
  };
}