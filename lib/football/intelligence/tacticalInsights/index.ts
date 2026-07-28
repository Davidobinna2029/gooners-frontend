// lib/football/intelligence/tacticalInsights/index.ts

import type { MatchIntelligence } from "../matchIntelligence";
import type { MatchMomentum } from "../momentumEngine";

import type {
  DetectorContext,
  MatchTacticalInsights,
  Side,
  TacticalCategory,
  TacticalInsight,
  TacticalInsights,
} from "./types";

import { detectPressing } from "./detectPressing";
import { detectWidth } from "./detectWidth";
import { detectTempo } from "./detectTempo";
import { detectBuildUp } from "./detectBuildUp";
import { detectTransitions } from "./detectTransitions";
import { detectPossession } from "./detectPossession";
import { detectMatchControl } from "./detectMatchControl";
import { detectStrengths } from "./detectStrengths";
import { detectWeaknesses } from "./detectWeaknesses";

const TACTICAL_INSIGHTS_VERSION = "1.0.0";

/**
 * Maps each detector's TacticalCategory onto the four buckets
 * TacticalInsights actually groups by. "pressing" is a defending
 * phenomenon and "shape" (width) is an attacking one, so they fold
 * into those buckets rather than getting buckets of their own.
 */
function bucketFor(category: TacticalCategory): keyof TacticalInsights {
  switch (category) {
    case "attack":
    case "shape":
      return "attacking";
    case "defence":
    case "pressing":
      return "defending";
    case "transition":
      return "transition";
    case "possession":
    default:
      return "possession";
  }
}

function groupIntoBuckets(insights: TacticalInsight[]): TacticalInsights {
  const grouped: TacticalInsights = {
    attacking: [],
    defending: [],
    transition: [],
    possession: [],
  };

  for (const insight of insights) {
    grouped[bucketFor(insight.category)].push(insight);
  }

  return grouped;
}

function buildTeamTacticalInsights(
  context: DetectorContext,
  momentum: MatchMomentum
): TacticalInsights {

  const all: TacticalInsight[] = [
    ...detectPressing(context),
    ...detectWidth(context),
    ...detectTempo(context),
    ...detectBuildUp(context),
    ...detectTransitions(context),
    ...detectPossession(context),
    ...detectMatchControl(context.side, momentum),
    ...detectStrengths(context),
    ...detectWeaknesses(context),
  ];

  return groupIntoBuckets(all);

}

/**
 * Public API. Runs every detector for both sides and returns a
 * fully-grouped tactical read of the match.
 *
 * NOTE: `formations` isn't a parameter yet — there's no real
 * MatchFormations type to consume until formationShiftEngine.ts
 * exists. Add it here (and thread it into detectBuildUp in
 * particular) once that file is real.
 */
export function buildTacticalInsights(
  intelligence: MatchIntelligence,
  momentum: MatchMomentum
): MatchTacticalInsights {

  const homeContext: DetectorContext = {
    side: "home",
    self: intelligence.home,
    opponent: intelligence.away,
  };

  const awayContext: DetectorContext = {
    side: "away",
    self: intelligence.away,
    opponent: intelligence.home,
  };

  return {
    generatedAt: new Date().toISOString(),
    version: TACTICAL_INSIGHTS_VERSION,
    home: buildTeamTacticalInsights(homeContext, momentum),
    away: buildTeamTacticalInsights(awayContext, momentum),
  };

}

/* ==========================================================
   RE-EXPORTS

   So consumers can `import { TacticalInsight } from
   "@/lib/football/intelligence/tacticalInsights"` without
   reaching into individual detector files.
========================================================== */

export type {
  TacticalCategory,
  TacticalInsight,
  TacticalInsights,
  MatchTacticalInsights,
  Side,
  DetectorContext,
};

export {
  detectPressing,
  detectWidth,
  detectTempo,
  detectBuildUp,
  detectTransitions,
  detectPossession,
  detectMatchControl,
  detectStrengths,
  detectWeaknesses,
};