// ==========================================================
// Match Analysis Engine
// ArsenalTalks Intelligence
// ==========================================================

import type { MatchViewModel } from "@/lib/football/models/matchViewModel";

import type {
  MatchIntelligence,
} from "@/lib/football/intelligence/matchIntelligence";

import type {
  TacticalInsight,
} from "@/lib/football/intelligence/tacticalInsightsEngine";

import type {
  MatchMomentum,
} from "@/lib/football/intelligence/momentumEngine";

import type {
  MatchFormations,
} from "@/lib/football/intelligence/formationShiftEngine";

// ==========================================================
// Editorial Analysis
// ==========================================================

export interface MatchAnalysis {
  headline: string;
  summary: string;
  keyPoints: string[];
}

// ==========================================================
// Build Input
// ==========================================================

interface BuildInput {
  match: MatchViewModel;
  intelligence: MatchIntelligence;
  tacticalInsights: TacticalInsight[];
  momentum: MatchMomentum;
  formationShifts: MatchFormations;
}

// ==========================================================
// Engine
// ==========================================================

export function buildMatchAnalysis(
  input: BuildInput
): MatchAnalysis {

  const keyPoints: string[] = [];

  if (input.tacticalInsights.length > 0) {
    keyPoints.push(
      `${input.tacticalInsights.length} tactical insights detected.`
    );
  }

  if (input.momentum.pressureWaves.length > 0) {
    keyPoints.push(
      `${input.momentum.pressureWaves.length} pressure waves identified.`
    );
  }

  if (
    input.formationShifts.home.length +
      input.formationShifts.away.length >
    0
  ) {
    keyPoints.push(
      "Formation changes detected during the match."
    );
  }

  if (keyPoints.length === 0) {
    keyPoints.push(
      "No significant tactical events detected."
    );
  }

  return {
    headline: `${input.match.homeTeam} vs ${input.match.awayTeam}`,

    summary:
      "Automated editorial summary generated from ArsenalTalks Football Intelligence.",

    keyPoints,
  };
}