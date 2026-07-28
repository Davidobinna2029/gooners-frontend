// lib/football/intelligence/tacticalInsights/detectWidth.ts

import type { DetectorContext, TacticalInsight } from "./types";
import { createInsight } from "./helpers";
import { THRESHOLDS } from "./thresholds";

/**
 * Classifies attacking width as Narrow, Balanced, or Wide.
 * Always returns exactly one insight — width is a spectrum every
 * team sits somewhere on, not a pattern that's merely present or absent.
 */
export function detectWidth({ side, self }: DetectorContext): TacticalInsight[] {

  const { attackingWidth } = self.progression;
  const t = THRESHOLDS.width;

  if (attackingWidth < t.narrow) {
    return [
      createInsight(
        `${side}-narrow-width`,
        "Narrow Attacking Shape",
        "shape",
        0.8,
        "Attacks were concentrated through central areas rather than out wide.",
        [`Attacking width ${attackingWidth.toFixed(0)}`]
      ),
    ];
  }

  if (attackingWidth > t.wide) {
    return [
      createInsight(
        `${side}-wide-width`,
        "Very Wide Attacking Shape",
        "shape",
        0.8,
        "This side stretched play from touchline to touchline to create space.",
        [`Attacking width ${attackingWidth.toFixed(0)}`]
      ),
    ];
  }

  return [
    createInsight(
      `${side}-balanced-width`,
      "Balanced Width",
      "shape",
      0.7,
      "Attacking width was evenly spread between central and wide areas.",
      [`Attacking width ${attackingWidth.toFixed(0)}`]
    ),
  ];

}