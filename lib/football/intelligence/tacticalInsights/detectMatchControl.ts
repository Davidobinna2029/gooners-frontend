// lib/football/intelligence/tacticalInsights/detectMatchControl.ts

import type { MatchMomentum } from "../momentumEngine";
import type { Side, TacticalInsight } from "./types";
import { createInsight } from "./helpers";

/**
 * Reads the momentum engine's own weighted verdict (see
 * momentumEngine.ts's WINNER_POINTS) rather than recomputing
 * dominance from scratch — match control is fundamentally a
 * momentum-timeline question, not a single-snapshot one.
 */
export function detectMatchControl(
  side: Side,
  momentum: MatchMomentum
): TacticalInsight[] {

  if (momentum.overallWinner === "balanced") {
    return [
      createInsight(
        `${side}-balanced-control`,
        "Balanced Contest",
        "possession",
        0.75,
        "Momentum swung between both sides without either establishing lasting control.",
        []
      ),
    ];
  }

  if (momentum.overallWinner === side) {
    return [
      createInsight(
        `${side}-dominating`,
        "Dominating",
        "possession",
        0.85,
        "This side controlled the majority of the match's momentum.",
        []
      ),
    ];
  }

  return [
    createInsight(
      `${side}-under-pressure`,
      "Under Pressure",
      "possession",
      0.85,
      "The opposition controlled the majority of the match's momentum.",
      []
    ),
  ];

}