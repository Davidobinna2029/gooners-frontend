// lib/football/intelligence/tacticalInsights/detectStrengths.ts

import type { DetectorContext, TacticalInsight } from "./types";
import { createInsight } from "./helpers";
import { THRESHOLDS } from "./thresholds";

export function detectStrengths({ side, self }: DetectorContext): TacticalInsight[] {

  const insights: TacticalInsight[] = [];
  const t = THRESHOLDS.strengths;

  if (self.dominance.fieldTilt > t.fieldTilt) {
    insights.push(
      createInsight(
        `${side}-strength-field-tilt`,
        "Excellent Field Tilt",
        "possession",
        0.8,
        "Sustained territorial dominance pushed the opposition back for long spells.",
        [`Field tilt ${self.dominance.fieldTilt.toFixed(0)}`]
      )
    );
  }

  if (self.progression.progressivePasses > t.progressivePasses) {
    insights.push(
      createInsight(
        `${side}-strength-progression`,
        "Strong Progressive Passing",
        "attack",
        0.8,
        "Consistently advanced play through incisive forward passing.",
        [`Progressive passes ${self.progression.progressivePasses.toFixed(0)}`]
      )
    );
  }

  if (self.progression.finalThirdEntries > t.finalThirdEntries) {
    insights.push(
      createInsight(
        `${side}-strength-final-third`,
        "High Territorial Dominance",
        "attack",
        0.8,
        "Regularly established attacks deep in the opposition's territory.",
        [`Final third entries ${self.progression.finalThirdEntries.toFixed(0)}`]
      )
    );
  }

  return insights;

}