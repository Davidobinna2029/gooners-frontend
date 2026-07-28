// lib/football/intelligence/tacticalInsights/detectPossession.ts

import type { DetectorContext, TacticalInsight } from "./types";
import { createInsight } from "./helpers";
import { THRESHOLDS } from "./thresholds";

/**
 * Detects possession-based playing style. Not mutually exclusive —
 * "Direct Team" and "Vertical Team" describe different aspects of
 * a low-possession side and can both apply at once.
 */
export function detectPossession({ side, self }: DetectorContext): TacticalInsight[] {

  const insights: TacticalInsight[] = [];

  const { possessionValue, tempoIndex } = self.dominance;
  const { progressiveCarries } = self.progression;
  const t = THRESHOLDS.possession;

  if (possessionValue > t.possessionTeam) {
    insights.push(
      createInsight(
        `${side}-possession-team`,
        "Possession Team",
        "possession",
        0.86,
        "This side dictated the game through sustained control of the ball.",
        [`Possession ${possessionValue.toFixed(0)}%`]
      )
    );
  }

  if (possessionValue < t.directTeamPossession && tempoIndex > THRESHOLDS.tempo.fast) {
    insights.push(
      createInsight(
        `${side}-direct-team`,
        "Direct Team",
        "possession",
        0.72,
        "With less of the ball, this side favoured quick, direct play over sustained build-up.",
        [
          `Possession ${possessionValue.toFixed(0)}%`,
          `Tempo index ${tempoIndex.toFixed(0)}`,
        ]
      )
    );
  }

  if (tempoIndex > t.verticalTempo && progressiveCarries > t.verticalCarries) {
    insights.push(
      createInsight(
        `${side}-vertical-team`,
        "Vertical Team",
        "possession",
        0.8,
        "Play was progressed vertically and quickly through frequent ball-carrying.",
        [
          `Tempo index ${tempoIndex.toFixed(0)}`,
          `Progressive carries ${progressiveCarries.toFixed(0)}`,
        ]
      )
    );
  }

  return insights;

}