// lib/football/intelligence/tacticalInsights/detectTempo.ts

import type { DetectorContext, TacticalInsight } from "./types";
import { createInsight } from "./helpers";
import { THRESHOLDS } from "./thresholds";

/**
 * Classifies playing tempo as Slow, Medium, or Fast. Always returns
 * exactly one insight, same reasoning as detectWidth.
 */
export function detectTempo({ side, self }: DetectorContext): TacticalInsight[] {

  const { tempoIndex } = self.dominance;
  const t = THRESHOLDS.tempo;

  if (tempoIndex < t.slow) {
    return [
      createInsight(
        `${side}-slow-tempo`,
        "Slow Tempo",
        "possession",
        0.75,
        "Play was built patiently at a controlled pace.",
        [`Tempo index ${tempoIndex.toFixed(0)}`]
      ),
    ];
  }

  if (tempoIndex > t.fast) {
    return [
      createInsight(
        `${side}-fast-tempo`,
        "Fast Tempo",
        "possession",
        0.8,
        "This side played at a high tempo, moving the ball quickly.",
        [`Tempo index ${tempoIndex.toFixed(0)}`]
      ),
    ];
  }

  return [
    createInsight(
      `${side}-medium-tempo`,
      "Medium Tempo",
      "possession",
      0.7,
      "Tempo sat at a moderate, balanced level throughout.",
      [`Tempo index ${tempoIndex.toFixed(0)}`]
    ),
  ];

}