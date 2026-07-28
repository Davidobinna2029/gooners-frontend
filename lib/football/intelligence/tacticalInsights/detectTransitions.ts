// lib/football/intelligence/tacticalInsights/detectTransitions.ts

import type { DetectorContext, TacticalInsight } from "./types";
import { createInsight } from "./helpers";
import { THRESHOLDS } from "./thresholds";

/**
 * Detects transition-phase patterns. Unlike the classifiers above,
 * these aren't mutually exclusive — a team can counter-attack AND
 * organise a strong rest defence in the same match.
 */
export function detectTransitions({ side, self }: DetectorContext): TacticalInsight[] {

  const insights: TacticalInsight[] = [];

  const { possessionValue, dangerousAttacks, tempoIndex } = self.dominance;
  const { counterPressRecoveries, defensiveCompactness } = self.defending;
  const t = THRESHOLDS.transitions;

  if (possessionValue < t.counterPossession && dangerousAttacks > t.counterDangerousAttacks) {
    insights.push(
      createInsight(
        `${side}-counter-attack`,
        "Counter Attack",
        "transition",
        0.87,
        "This side threatened primarily by breaking quickly after winning the ball back.",
        [
          `Possession ${possessionValue.toFixed(0)}%`,
          `Dangerous attacks ${dangerousAttacks.toFixed(0)}`,
        ]
      )
    );
  }

  if (tempoIndex > t.fastTransitionTempo && dangerousAttacks > t.fastTransitionDangerousAttacks) {
    insights.push(
      createInsight(
        `${side}-fast-transition`,
        "Fast Transition",
        "transition",
        0.8,
        "Attacks moved from defence to attack rapidly once possession was regained.",
        [
          `Tempo index ${tempoIndex.toFixed(0)}`,
          `Dangerous attacks ${dangerousAttacks.toFixed(0)}`,
        ]
      )
    );
  }

  if (defensiveCompactness > t.restDefenceCompactness && counterPressRecoveries > t.restDefenceRecoveries) {
    insights.push(
      createInsight(
        `${side}-rest-defence`,
        "Organised Rest Defence",
        "transition",
        0.78,
        "This side stayed well-structured behind the ball, recovering possession quickly after losing it.",
        [
          `Compactness ${defensiveCompactness.toFixed(0)}`,
          `Counter-press recoveries ${counterPressRecoveries.toFixed(0)}`,
        ]
      )
    );
  }

  return insights;

}