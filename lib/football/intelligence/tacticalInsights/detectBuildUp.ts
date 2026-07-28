// lib/football/intelligence/tacticalInsights/detectBuildUp.ts

import type { DetectorContext, TacticalInsight } from "./types";
import { createInsight } from "./helpers";
import { THRESHOLDS } from "./thresholds";

/**
 * Classifies build-up style as Short Build-up, Direct Build-up, or
 * Mixed. NOTE: without a pass-length or long-ball metric in
 * TeamIntelligence yet, "Direct" is approximated here from tempo +
 * progressive carries rather than actual long-ball frequency —
 * revisit once that data exists.
 */
export function detectBuildUp({ side, self }: DetectorContext): TacticalInsight[] {

  const { tempoIndex } = self.dominance;
  const { progressivePasses, progressiveCarries } = self.progression;
  const t = THRESHOLDS.buildUp;

  if (tempoIndex < t.shortBuildUpTempo && progressivePasses > t.shortBuildUpPasses) {
    return [
      createInsight(
        `${side}-short-buildup`,
        "Short Build-up",
        "possession",
        0.78,
        "Play progressed through patient, short passing combinations rather than direct balls.",
        [
          `Tempo index ${tempoIndex.toFixed(0)}`,
          `Progressive passes ${progressivePasses.toFixed(0)}`,
        ]
      ),
    ];
  }

  if (tempoIndex > t.directTempo && progressiveCarries > t.directCarries) {
    return [
      createInsight(
        `${side}-direct-buildup`,
        "Direct Build-up",
        "possession",
        0.72,
        "This side bypassed midfield quickly, favouring direct progression over sustained passing spells.",
        [
          `Tempo index ${tempoIndex.toFixed(0)}`,
          `Progressive carries ${progressiveCarries.toFixed(0)}`,
        ]
      ),
    ];
  }

  return [
    createInsight(
      `${side}-mixed-buildup`,
      "Mixed Build-up",
      "possession",
      0.6,
      "Build-up play mixed patient passing with more direct progression depending on the situation.",
      []
    ),
  ];

}