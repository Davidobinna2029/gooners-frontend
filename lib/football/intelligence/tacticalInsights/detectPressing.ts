// lib/football/intelligence/tacticalInsights/detectPressing.ts

import type { DetectorContext, TacticalInsight } from "./types";
import { createInsight } from "./helpers";
import { THRESHOLDS } from "./thresholds";

/**
 * Classifies a team's out-of-possession shape as High Press, Low
 * Block, or Mid Block. Mutually exclusive by design — a team plays
 * one defensive shape at a time, not several at once.
 */
export function detectPressing({ side, self }: DetectorContext): TacticalInsight[] {

  const { PPDA, defensiveLineHeight, defensiveCompactness } = self.defending;
  const t = THRESHOLDS.pressing;

  if (PPDA < t.highPressPpda) {
    return [
      createInsight(
        `${side}-high-press`,
        "High Press",
        "pressing",
        0.9,
        "This side pressed aggressively high up the pitch, denying the opponent time on the ball.",
        [`PPDA ${PPDA.toFixed(1)}`]
      ),
    ];
  }

  if (
    defensiveLineHeight < t.lowBlockLineHeight &&
    defensiveCompactness > t.lowBlockCompactness
  ) {
    return [
      createInsight(
        `${side}-low-block`,
        "Low Block",
        "pressing",
        0.85,
        "This side sat deep and defended in a compact low block rather than pressing high.",
        [
          `Defensive line height ${defensiveLineHeight.toFixed(0)}`,
          `Compactness ${defensiveCompactness.toFixed(0)}`,
        ]
      ),
    ];
  }

  if (
    defensiveLineHeight >= t.midBlockMin &&
    defensiveLineHeight <= t.midBlockMax
  ) {
    return [
      createInsight(
        `${side}-mid-block`,
        "Mid Block",
        "pressing",
        0.75,
        "This side held a mid-block, neither pressing high nor retreating into a deep line.",
        [`Defensive line height ${defensiveLineHeight.toFixed(0)}`]
      ),
    ];
  }

  return [];

}