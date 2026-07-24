// lib/football/intelligence/tacticalInsightsEngine.ts
import type {
  MatchIntelligence,
} from "./matchIntelligence";
/* ==========================================================
   INSIGHT CATEGORY
========================================================== */
export type InsightCategory =
  | "pressing"
  | "possession"
  | "territory"
  | "progression"
  | "chance_creation"
  | "tempo"
  | "transition"
  | "defending"
  | "discipline"
  | "tactical";
/* ==========================================================
   SEVERITY
========================================================== */
export type InsightSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";
/* ==========================================================
   TEAM
========================================================== */
export type InsightTeam =
  | "home"
  | "away"
  | "both";
/* ==========================================================
   INSIGHT
========================================================== */
export interface TacticalInsight {
  id: string;
  category: InsightCategory;
  team: InsightTeam;
  severity: InsightSeverity;
  /**
   * 0.0 → 1.0
   */
  confidence: number;
  title: string;
  description: string;
}
/* ==========================================================
   RULE CONTEXT
========================================================== */
export interface RuleContext {
  intelligence: MatchIntelligence;
}
/* ==========================================================
   RULE
========================================================== */
export interface TacticalInsightRule {
  id: string;
  name: string;
  evaluate(
    context: RuleContext
  ): TacticalInsight[];
}
/* ==========================================================
   HELPERS
========================================================== */
function createInsight(
  id: string,
  category: InsightCategory,
  team: InsightTeam,
  severity: InsightSeverity,
  confidence: number,
  title: string,
  description: string
): TacticalInsight {
  return {
    id,
    category,
    team,
    severity,
    confidence,
    title,
    description,
  };
}
/* ==========================================================
   CONFIDENCE
========================================================== */
function clampConfidence(
  value: number
): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Number(
    value.toFixed(2)
  );
}
/* ==========================================================
   SORTING
========================================================== */
const severityWeight: Record<
  InsightSeverity,
  number
> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};
function compareInsights(
  a: TacticalInsight,
  b: TacticalInsight
) {
  if (
    severityWeight[a.severity] !==
    severityWeight[b.severity]
  ) {
    return (
      severityWeight[b.severity] -
      severityWeight[a.severity]
    );
  }
  return (
    b.confidence -
    a.confidence
  );
}

/* ==========================================================
   RULES (SECTION 2A)
========================================================== */

const highPressRule: TacticalInsightRule = {
  id: "high-press",

  name: "Aggressive High Press",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    const home = intelligence.home.defending;

    const away = intelligence.away.defending;

    if (
      home.PPDA < 8 &&
      home.counterPressRecoveries > 12
    ) {

      insights.push(
        createInsight(
          "high-press-home",
          "pressing",
          "home",
          "high",
          clampConfidence(0.92),
          "Aggressive High Press",
          "The home side consistently disrupted opposition build-up through coordinated pressing."
        )
      );

    }

    if (
      away.PPDA < 8 &&
      away.counterPressRecoveries > 12
    ) {

      insights.push(
        createInsight(
          "high-press-away",
          "pressing",
          "away",
          "high",
          clampConfidence(0.92),
          "Aggressive High Press",
          "The away side consistently disrupted opposition build-up through coordinated pressing."
        )
      );

    }

    return insights;

  },

};

const lowBlockRule: TacticalInsightRule = {

  id: "low-block",

  name: "Compact Low Block",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    const home = intelligence.home.defending;

    const away = intelligence.away.defending;

    if (
      home.defensiveLineHeight < 35 &&
      home.defensiveCompactness > 70
    ) {

      insights.push(
        createInsight(
          "low-block-home",
          "defending",
          "home",
          "medium",
          clampConfidence(0.84),
          "Compact Low Block",
          "The home side defended with a compact low block."
        )
      );

    }

    if (
      away.defensiveLineHeight < 35 &&
      away.defensiveCompactness > 70
    ) {

      insights.push(
        createInsight(
          "low-block-away",
          "defending",
          "away",
          "medium",
          clampConfidence(0.84),
          "Compact Low Block",
          "The away side defended with a compact low block."
        )
      );

    }

    return insights;

  },

};

const territorialDominanceRule: TacticalInsightRule = {

  id: "territory",

  name: "Territorial Dominance",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.dominance.fieldTilt > 65
    ) {

      insights.push(
        createInsight(
          "territory-home",
          "territory",
          "home",
          "high",
          clampConfidence(0.90),
          "Territorial Dominance",
          "The home side controlled territory for long periods."
        )
      );

    }

    if (
      intelligence.away.dominance.fieldTilt > 65
    ) {

      insights.push(
        createInsight(
          "territory-away",
          "territory",
          "away",
          "high",
          clampConfidence(0.90),
          "Territorial Dominance",
          "The away side controlled territory for long periods."
        )
      );

    }

    return insights;

  },

};

const possessionControlRule: TacticalInsightRule = {

  id: "possession-control",

  name: "Possession Control",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.dominance.possessionValue >
      intelligence.away.dominance.possessionValue * 1.25
    ) {

      insights.push(
        createInsight(
          "possession-home",
          "possession",
          "home",
          "high",
          clampConfidence(0.88),
          "Controlled Possession",
          "The home side dictated the rhythm through sustained possession."
        )
      );

    }

    if (
      intelligence.away.dominance.possessionValue >
      intelligence.home.dominance.possessionValue * 1.25
    ) {

      insights.push(
        createInsight(
          "possession-away",
          "possession",
          "away",
          "high",
          clampConfidence(0.88),
          "Controlled Possession",
          "The away side dictated the rhythm through sustained possession."
        )
      );

    }

    return insights;

  },

};

const fastTempoRule: TacticalInsightRule = {

  id: "fast-tempo",

  name: "High Tempo",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.dominance.tempoIndex > 70
    ) {

      insights.push(
        createInsight(
          "tempo-home",
          "tempo",
          "home",
          "medium",
          clampConfidence(0.82),
          "High Tempo",
          "The home side maintained a quick attacking rhythm."
        )
      );

    }

    if (
      intelligence.away.dominance.tempoIndex > 70
    ) {

      insights.push(
        createInsight(
          "tempo-away",
          "tempo",
          "away",
          "medium",
          clampConfidence(0.82),
          "High Tempo",
          "The away side maintained a quick attacking rhythm."
        )
      );

    }

    return insights;

  },

};

const slowTempoRule: TacticalInsightRule = {

  id: "slow-tempo",

  name: "Patient Build-up",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.dominance.tempoIndex < 40
    ) {

      insights.push(
        createInsight(
          "slow-home",
          "tempo",
          "home",
          "low",
          clampConfidence(0.76),
          "Patient Build-up",
          "The home side slowed the game to build attacks carefully."
        )
      );

    }

    if (
      intelligence.away.dominance.tempoIndex < 40
    ) {

      insights.push(
        createInsight(
          "slow-away",
          "tempo",
          "away",
          "low",
          clampConfidence(0.76),
          "Patient Build-up",
          "The away side slowed the game to build attacks carefully."
        )
      );

    }

    return insights;

  },

};

const progressivePassingRule: TacticalInsightRule = {

  id: "progressive-passing",

  name: "Vertical Progression",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.progression.progressivePasses >
      intelligence.away.progression.progressivePasses * 1.4
    ) {

      insights.push(
        createInsight(
          "prog-pass-home",
          "progression",
          "home",
          "medium",
          clampConfidence(0.83),
          "Vertical Progression",
          "The home side consistently progressed play through forward passing."
        )
      );

    }

    if (
      intelligence.away.progression.progressivePasses >
      intelligence.home.progression.progressivePasses * 1.4
    ) {

      insights.push(
        createInsight(
          "prog-pass-away",
          "progression",
          "away",
          "medium",
          clampConfidence(0.83),
          "Vertical Progression",
          "The away side consistently progressed play through forward passing."
        )
      );

    }

    return insights;

  },

};

const progressiveCarryRule: TacticalInsightRule = {

  id: "progressive-carries",

  name: "Progressive Carries",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.progression.progressiveCarries >
      intelligence.away.progression.progressiveCarries * 1.4
    ) {

      insights.push(
        createInsight(
          "carry-home",
          "progression",
          "home",
          "medium",
          clampConfidence(0.81),
          "Ball Carry Progression",
          "The home side advanced play through progressive carries."
        )
      );

    }

    if (
      intelligence.away.progression.progressiveCarries >
      intelligence.home.progression.progressiveCarries * 1.4
    ) {

      insights.push(
        createInsight(
          "carry-away",
          "progression",
          "away",
          "medium",
          clampConfidence(0.81),
          "Ball Carry Progression",
          "The away side advanced play through progressive carries."
        )
      );

    }

    return insights;

  },

};

const widePlayRule: TacticalInsightRule = {

  id: "wide-play",

  name: "Wide Attacking Shape",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.progression.attackingWidth > 75
    ) {

      insights.push(
        createInsight(
          "width-home",
          "tactical",
          "home",
          "medium",
          clampConfidence(0.80),
          "Wide Attacking Shape",
          "The home side stretched the pitch to create space."
        )
      );

    }

    if (
      intelligence.away.progression.attackingWidth > 75
    ) {

      insights.push(
        createInsight(
          "width-away",
          "tactical",
          "away",
          "medium",
          clampConfidence(0.80),
          "Wide Attacking Shape",
          "The away side stretched the pitch to create space."
        )
      );

    }

    return insights;

  },

};

const dangerousTransitionRule: TacticalInsightRule = {

  id: "dangerous-transition",

  name: "Dangerous Transition Play",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.dominance.dangerousAttacks >
      intelligence.away.dominance.dangerousAttacks * 1.5
    ) {

      insights.push(
        createInsight(
          "transition-home",
          "transition",
          "home",
          "high",
          clampConfidence(0.89),
          "Dangerous Transition Play",
          "The home side created repeated dangerous attacks in transition."
        )
      );

    }

    if (
      intelligence.away.dominance.dangerousAttacks >
      intelligence.home.dominance.dangerousAttacks * 1.5
    ) {

      insights.push(
        createInsight(
          "transition-away",
          "transition",
          "away",
          "high",
          clampConfidence(0.89),
          "Dangerous Transition Play",
          "The away side created repeated dangerous attacks in transition."
        )
      );

    }

    return insights;

  },

};

/* ==========================================================
   RULES (SECTION 2B)
========================================================== */

const defensiveResilienceRule: TacticalInsightRule = {
  id: "defensive-resilience",

  name: "Defensive Resilience",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.defending.defensiveCompactness > 80
    ) {

      insights.push(
        createInsight(
          "defensive-home",
          "defending",
          "home",
          "high",
          clampConfidence(0.91),
          "Defensive Resilience",
          "The home side remained compact and difficult to break down."
        )
      );

    }

    if (
      intelligence.away.defending.defensiveCompactness > 80
    ) {

      insights.push(
        createInsight(
          "defensive-away",
          "defending",
          "away",
          "high",
          clampConfidence(0.91),
          "Defensive Resilience",
          "The away side remained compact and difficult to break down."
        )
      );

    }

    return insights;

  },

};

const highTurnoverRule: TacticalInsightRule = {

  id: "high-turnovers",

  name: "High Turnovers",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.defending.highTurnovers > 10
    ) {

      insights.push(
        createInsight(
          "turnovers-home",
          "pressing",
          "home",
          "medium",
          clampConfidence(0.84),
          "High Turnovers",
          "The home side consistently won possession high up the pitch."
        )
      );

    }

    if (
      intelligence.away.defending.highTurnovers > 10
    ) {

      insights.push(
        createInsight(
          "turnovers-away",
          "pressing",
          "away",
          "medium",
          clampConfidence(0.84),
          "High Turnovers",
          "The away side consistently won possession high up the pitch."
        )
      );

    }

    return insights;

  },

};

const finalThirdRule: TacticalInsightRule = {

  id: "final-third",

  name: "Final Third Dominance",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.progression.finalThirdEntries >
      intelligence.away.progression.finalThirdEntries * 1.35
    ) {

      insights.push(
        createInsight(
          "final-third-home",
          "territory",
          "home",
          "high",
          clampConfidence(0.88),
          "Final Third Dominance",
          "The home side consistently established attacks inside the final third."
        )
      );

    }

    if (
      intelligence.away.progression.finalThirdEntries >
      intelligence.home.progression.finalThirdEntries * 1.35
    ) {

      insights.push(
        createInsight(
          "final-third-away",
          "territory",
          "away",
          "high",
          clampConfidence(0.88),
          "Final Third Dominance",
          "The away side consistently established attacks inside the final third."
        )
      );

    }

    return insights;

  },

};

const penaltyAreaRule: TacticalInsightRule = {

  id: "penalty-area",

  name: "Penalty Area Occupation",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.progression.penaltyAreaEntries >
      intelligence.away.progression.penaltyAreaEntries * 1.40
    ) {

      insights.push(
        createInsight(
          "box-home",
          "chance_creation",
          "home",
          "high",
          clampConfidence(0.87),
          "Penalty Area Presence",
          "The home side repeatedly entered dangerous scoring positions."
        )
      );

    }

    if (
      intelligence.away.progression.penaltyAreaEntries >
      intelligence.home.progression.penaltyAreaEntries * 1.40
    ) {

      insights.push(
        createInsight(
          "box-away",
          "chance_creation",
          "away",
          "high",
          clampConfidence(0.87),
          "Penalty Area Presence",
          "The away side repeatedly entered dangerous scoring positions."
        )
      );

    }

    return insights;

  },

};

const xARule: TacticalInsightRule = {

  id: "xa",

  name: "Chance Creation",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.chanceCreation.xA >
      intelligence.away.chanceCreation.xA * 1.35
    ) {

      insights.push(
        createInsight(
          "xa-home",
          "chance_creation",
          "home",
          "medium",
          clampConfidence(0.83),
          "Creative Passing",
          "The home side generated higher-quality chances through creative passing."
        )
      );

    }

    if (
      intelligence.away.chanceCreation.xA >
      intelligence.home.chanceCreation.xA * 1.35
    ) {

      insights.push(
        createInsight(
          "xa-away",
          "chance_creation",
          "away",
          "medium",
          clampConfidence(0.83),
          "Creative Passing",
          "The away side generated higher-quality chances through creative passing."
        )
      );

    }

    return insights;

  },

};

const shotCreationRule: TacticalInsightRule = {

  id: "shot-creation",

  name: "Shot Creating Actions",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.chanceCreation.shotCreatingActions >
      intelligence.away.chanceCreation.shotCreatingActions * 1.30
    ) {

      insights.push(
        createInsight(
          "sca-home",
          "chance_creation",
          "home",
          "medium",
          clampConfidence(0.82),
          "Frequent Shot Creation",
          "The home side consistently created shooting opportunities."
        )
      );

    }

    if (
      intelligence.away.chanceCreation.shotCreatingActions >
      intelligence.home.chanceCreation.shotCreatingActions * 1.30
    ) {

      insights.push(
        createInsight(
          "sca-away",
          "chance_creation",
          "away",
          "medium",
          clampConfidence(0.82),
          "Frequent Shot Creation",
          "The away side consistently created shooting opportunities."
        )
      );

    }

    return insights;

  },

};

const goalCreationRule: TacticalInsightRule = {

  id: "goal-creation",

  name: "Goal Creating Actions",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.chanceCreation.goalCreatingActions >
      intelligence.away.chanceCreation.goalCreatingActions * 1.30
    ) {

      insights.push(
        createInsight(
          "gca-home",
          "chance_creation",
          "home",
          "high",
          clampConfidence(0.86),
          "Efficient Chance Conversion",
          "The home side repeatedly converted attacking sequences into clear chances."
        )
      );

    }

    if (
      intelligence.away.chanceCreation.goalCreatingActions >
      intelligence.home.chanceCreation.goalCreatingActions * 1.30
    ) {

      insights.push(
        createInsight(
          "gca-away",
          "chance_creation",
          "away",
          "high",
          clampConfidence(0.86),
          "Efficient Chance Conversion",
          "The away side repeatedly converted attacking sequences into clear chances."
        )
      );

    }

    return insights;

  },

};

const matchControlRule: TacticalInsightRule = {

  id: "match-control",

  name: "Match Control",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    const difference =
      Math.abs(
        intelligence.home.dominance.controlIndex -
        intelligence.away.dominance.controlIndex
      );

    if (difference > 20) {

      const team =
        intelligence.home.dominance.controlIndex >
        intelligence.away.dominance.controlIndex
          ? "home"
          : "away";

      insights.push(
        createInsight(
          "control",
          "tactical",
          team,
          "critical",
          clampConfidence(0.95),
          "Complete Match Control",
          `${team === "home" ? "The home side" : "The away side"} dictated the overall flow of the match.`
        )
      );

    }

    return insights;

  },

};

/* ==========================================================
   RULES (SECTION 2C)
========================================================== */

const balancedMatchRule: TacticalInsightRule = {
  id: "balanced-match",

  name: "Balanced Contest",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    const difference =
      Math.abs(
        intelligence.home.dominance.controlIndex -
        intelligence.away.dominance.controlIndex
      );

    if (difference < 8) {

      insights.push(
        createInsight(
          "balanced",
          "tactical",
          "both",
          "medium",
          clampConfidence(0.86),
          "Balanced Contest",
          "Neither side established prolonged tactical superiority."
        )
      );

    }

    return insights;

  },

};

const centralProgressionRule: TacticalInsightRule = {

  id: "central-progression",

  name: "Central Progression",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.progression.progressivePasses >
      35 &&
      intelligence.home.progression.attackingWidth < 55
    ) {

      insights.push(
        createInsight(
          "central-home",
          "progression",
          "home",
          "medium",
          clampConfidence(0.82),
          "Central Progression",
          "The home side preferred progressing through central areas."
        )
      );

    }

    if (
      intelligence.away.progression.progressivePasses >
      35 &&
      intelligence.away.progression.attackingWidth < 55
    ) {

      insights.push(
        createInsight(
          "central-away",
          "progression",
          "away",
          "medium",
          clampConfidence(0.82),
          "Central Progression",
          "The away side preferred progressing through central areas."
        )
      );

    }

    return insights;

  },

};

const directPlayRule: TacticalInsightRule = {

  id: "direct-play",

  name: "Direct Play",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.dominance.tempoIndex > 75 &&
      intelligence.home.progression.progressivePasses > 40
    ) {

      insights.push(
        createInsight(
          "direct-home",
          "tactical",
          "home",
          "medium",
          clampConfidence(0.84),
          "Direct Vertical Play",
          "The home side attacked quickly with vertical progression."
        )
      );

    }

    if (
      intelligence.away.dominance.tempoIndex > 75 &&
      intelligence.away.progression.progressivePasses > 40
    ) {

      insights.push(
        createInsight(
          "direct-away",
          "tactical",
          "away",
          "medium",
          clampConfidence(0.84),
          "Direct Vertical Play",
          "The away side attacked quickly with vertical progression."
        )
      );

    }

    return insights;

  },

};

const sustainedPressureRule: TacticalInsightRule = {

  id: "pressure",

  name: "Sustained Pressure",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.dominance.fieldTilt > 70 &&
      intelligence.home.progression.finalThirdEntries > 25
    ) {

      insights.push(
        createInsight(
          "pressure-home",
          "territory",
          "home",
          "high",
          clampConfidence(0.90),
          "Sustained Pressure",
          "The home side pinned the opposition deep for extended periods."
        )
      );

    }

    if (
      intelligence.away.dominance.fieldTilt > 70 &&
      intelligence.away.progression.finalThirdEntries > 25
    ) {

      insights.push(
        createInsight(
          "pressure-away",
          "territory",
          "away",
          "high",
          clampConfidence(0.90),
          "Sustained Pressure",
          "The away side pinned the opposition deep for extended periods."
        )
      );

    }

    return insights;

  },

};

const counterAttackRule: TacticalInsightRule = {

  id: "counter",

  name: "Counter Attacking",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.dominance.dangerousAttacks > 15 &&
      intelligence.home.dominance.possessionValue <
      intelligence.away.dominance.possessionValue
    ) {

      insights.push(
        createInsight(
          "counter-home",
          "transition",
          "home",
          "medium",
          clampConfidence(0.87),
          "Counter Attacking",
          "The home side threatened primarily through quick transitions."
        )
      );

    }

    if (
      intelligence.away.dominance.dangerousAttacks > 15 &&
      intelligence.away.dominance.possessionValue <
      intelligence.home.dominance.possessionValue
    ) {

      insights.push(
        createInsight(
          "counter-away",
          "transition",
          "away",
          "medium",
          clampConfidence(0.87),
          "Counter Attacking",
          "The away side threatened primarily through quick transitions."
        )
      );

    }

    return insights;

  },

};

const disciplinedDefendingRule: TacticalInsightRule = {

  id: "discipline",

  name: "Disciplined Defending",

  evaluate({ intelligence }) {

    const insights: TacticalInsight[] = [];

    if (
      intelligence.home.defending.defensiveCompactness > 85 &&
      intelligence.home.defending.PPDA > 10
    ) {

      insights.push(
        createInsight(
          "discipline-home",
          "discipline",
          "home",
          "medium",
          clampConfidence(0.81),
          "Disciplined Defending",
          "The home side defended patiently without overcommitting."
        )
      );

    }

    if (
      intelligence.away.defending.defensiveCompactness > 85 &&
      intelligence.away.defending.PPDA > 10
    ) {

      insights.push(
        createInsight(
          "discipline-away",
          "discipline",
          "away",
          "medium",
          clampConfidence(0.81),
          "Disciplined Defending",
          "The away side defended patiently without overcommitting."
        )
      );

    }

    return insights;

  },

};

/* ==========================================================
   RULE REGISTRY
========================================================== */
const RULES: TacticalInsightRule[] = [
  highPressRule,
  lowBlockRule,
  territorialDominanceRule,
  possessionControlRule,
  fastTempoRule,
  slowTempoRule,
  progressivePassingRule,
  progressiveCarryRule,
  widePlayRule,
  dangerousTransitionRule,
  defensiveResilienceRule,
  highTurnoverRule,
  finalThirdRule,
  penaltyAreaRule,
  xARule,
  shotCreationRule,
  goalCreationRule,
  matchControlRule,
  balancedMatchRule,
  centralProgressionRule,
  directPlayRule,
  sustainedPressureRule,
  counterAttackRule,
  disciplinedDefendingRule,
];
/* ==========================================================
   GENERATE TACTICAL INSIGHTS
========================================================== */
export function generateTacticalInsights(
  intelligence: MatchIntelligence
): TacticalInsight[] {
  const context: RuleContext = {
    intelligence,
  };
  const insights: TacticalInsight[] = [];
  for (const rule of RULES) {
    try {
      const result = rule.evaluate(context);
      if (result.length) {
        insights.push(...result);
      }
    } catch (error) {
      console.warn(
        `[TacticalInsights] Rule "${rule.name}" failed.`,
        error
      );
    }
  }
  return insights;
}

/* ==========================================================
   DEDUPLICATION
========================================================== */
function deduplicateInsights(
  insights: TacticalInsight[]
): TacticalInsight[] {
  const map = new Map<string, TacticalInsight>();
  for (const insight of insights) {
    const existing = map.get(insight.id);
    if (!existing) {
      map.set(insight.id, insight);
      continue;
    }
    if (insight.confidence > existing.confidence) {
      map.set(insight.id, insight);
    }
  }
  return [...map.values()];
}
/* ==========================================================
   FILTER LOW CONFIDENCE
========================================================== */
const MIN_CONFIDENCE = 0.60;
function filterInsights(
  insights: TacticalInsight[]
): TacticalInsight[] {
  return insights.filter(
    (insight) =>
      insight.confidence >= MIN_CONFIDENCE
  );
}
/* ==========================================================
   PRIORITY SORT
========================================================== */
function sortInsights(
  insights: TacticalInsight[]
): TacticalInsight[] {
  return [...insights].sort(compareInsights);
}
/* ==========================================================
   PUBLIC API
========================================================== */
export function buildTacticalInsights(
  intelligence: MatchIntelligence
): TacticalInsight[] {
  const generated =
    generateTacticalInsights(intelligence);
  const deduplicated =
    deduplicateInsights(generated);
  const filtered =
    filterInsights(deduplicated);
  return sortInsights(filtered);
}
/* ==========================================================
   EXPORTS
========================================================== */
export {
  RULES,
  compareInsights,
  clampConfidence,
};