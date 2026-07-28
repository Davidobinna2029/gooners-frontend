// lib/football/intelligence/tacticalInsights/detectWeaknesses.ts

import type { DetectorContext, TacticalInsight } from "./types";
import { createInsight } from "./helpers";
import { THRESHOLDS } from "./thresholds";

export function detectWeaknesses({ side, self, opponent }: DetectorContext): TacticalInsight[] {

  const insights: TacticalInsight[] = [];
  const t = THRESHOLDS.weaknesses;

  const { shotCreatingActions, goalCreatingActions } = self.chanceCreation;

  if (shotCreatingActions > 0) {
    const conversionRatio = goalCreatingActions / shotCreatingActions;

    if (conversionRatio < t.lowConversionRatio) {
      insights.push(
        createInsight(
          `${side}-weakness-conversion`,
          "Low Chance Conversion",
          "attack",
          0.75,
          "Created chances but struggled to turn them into clear-cut opportunities.",
          [
            `Goal-creating actions ${goalCreatingActions.toFixed(0)}`,
            `Shot-creating actions ${shotCreatingActions.toFixed(0)}`,
          ]
        )
      );
    }
  }

  if (self.defending.defensiveCompactness < t.weakCompactness) {
    insights.push(
      createInsight(
        `${side}-weakness-compactness`,
        "Weak Defensive Compactness",
        "defence",
        0.8,
        "Defensive lines were often stretched, leaving gaps for the opposition to exploit.",
        [`Compactness ${self.defending.defensiveCompactness.toFixed(0)}`]
      )
    );
  }

  if (opponent.defending.highTurnovers > t.highTurnoversAllowed) {
    insights.push(
      createInsight(
        `${side}-weakness-turnovers`,
        "Vulnerable to High Turnovers",
        "defence",
        0.75,
        "Lost possession in dangerous areas often enough for the opposition to press and recover it high up the pitch.",
        [`Opponent high turnovers ${opponent.defending.highTurnovers.toFixed(0)}`]
      )
    );
  }

  return insights;

}