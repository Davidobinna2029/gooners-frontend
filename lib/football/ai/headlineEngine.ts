import type { MatchIntelligence } from "@/lib/football/intelligence/matchIntelligence";
import type { MatchMomentum } from "@/lib/football/intelligence/momentumEngine";
import type { MatchFormations } from "@/lib/football/intelligence/formationShiftEngine";
import type {
  MatchTacticalInsights,
  TacticalInsight,
} from "@/lib/football/intelligence/tacticalInsights";

/* ==========================================================
   TYPES
========================================================== */

export type HeadlineCategory =
  | "Dominant Win"
  | "Late Winner"
  | "Comeback"
  | "Tactical Battle"
  | "Thriller"
  | "Defensive Masterclass"
  | "High Press"
  | "Counter Attack"
  | "Balanced Match";

export interface MatchHeadline {
  title: string;
  subtitle: string;
  category: HeadlineCategory;
  confidence: number;
  generatedAt: string;
}

export interface HeadlineContext {
  intelligence: MatchIntelligence;
  momentum: MatchMomentum;
  formations: MatchFormations;
  tactical: MatchTacticalInsights;
}

/* ==========================================================
   HELPERS
========================================================== */

function winner(intelligence: MatchIntelligence) {
  if (intelligence.score.home > intelligence.score.away) return "home";
  if (intelligence.score.away > intelligence.score.home) return "away";
  return "draw";
}

function winnerName(ctx: HeadlineContext) {
  const w = winner(ctx.intelligence);

  if (w === "home") return ctx.intelligence.home.information.name;
  if (w === "away") return ctx.intelligence.away.information.name;

  return "";
}

function loserName(ctx: HeadlineContext) {
  const w = winner(ctx.intelligence);

  if (w === "home") return ctx.intelligence.away.information.name;
  if (w === "away") return ctx.intelligence.home.information.name;

  return "";
}

function goals(ctx: HeadlineContext) {
  return (
    ctx.intelligence.score.home +
    ctx.intelligence.score.away
  );
}

function containsInsight(
  insights: TacticalInsight[],
  keyword: string
) {
  return insights.some(i =>
    i.title.toLowerCase().includes(keyword.toLowerCase())
  );
}

/* ==========================================================
   BUILD
========================================================== */

export function buildHeadline(
  context: HeadlineContext
): MatchHeadline {

  const home = context.intelligence.home;
  const away = context.intelligence.away;

  const score = context.intelligence.score;

  const goalDifference = Math.abs(
    score.home - score.away
  );

  const homeInsights = [
    ...context.tactical.home.attacking,
    ...context.tactical.home.defending,
    ...context.tactical.home.transition,
    ...context.tactical.home.possession,
  ];

  const awayInsights = [
    ...context.tactical.away.attacking,
    ...context.tactical.away.defending,
    ...context.tactical.away.transition,
    ...context.tactical.away.possession,
  ];

  /* -------------------------------------- */
  /* DOMINANT WIN                           */
  /* -------------------------------------- */

  if (
    goalDifference >= 2 &&
    Math.max(
      home.dominance.controlIndex,
      away.dominance.controlIndex
    ) > 70
  ) {

    return {
      title: `${winnerName(context)} dominate ${loserName(context)}`,
      subtitle:
        "Superior control and territorial dominance decided the match.",
      category: "Dominant Win",
      confidence: 0.96,
      generatedAt: new Date().toISOString(),
    };

  }

  /* -------------------------------------- */
  /* HIGH PRESS                             */
  /* -------------------------------------- */

  if (
    containsInsight(homeInsights, "High Press") ||
    containsInsight(awayInsights, "High Press")
  ) {

    return {
      title: `${winnerName(context)} win through relentless pressing`,
      subtitle:
        "Aggressive pressure forced repeated turnovers.",
      category: "High Press",
      confidence: 0.94,
      generatedAt: new Date().toISOString(),
    };

  }

  /* -------------------------------------- */
  /* COUNTER ATTACK                         */
  /* -------------------------------------- */

  if (
    containsInsight(homeInsights, "Counter") ||
    containsInsight(awayInsights, "Counter")
  ) {

    return {
      title: `${winnerName(context)} strike on the counter`,
      subtitle:
        "Fast transitions proved decisive.",
      category: "Counter Attack",
      confidence: 0.91,
      generatedAt: new Date().toISOString(),
    };

  }

  /* -------------------------------------- */
  /* DEFENSIVE MASTERCLASS                  */
  /* -------------------------------------- */

  if (
    home.defending.defensiveCompactness > 85 ||
    away.defending.defensiveCompactness > 85
  ) {

    return {
      title: `${winnerName(context)} produce defensive masterclass`,
      subtitle:
        "Compact defending frustrated the opposition.",
      category: "Defensive Masterclass",
      confidence: 0.90,
      generatedAt: new Date().toISOString(),
    };

  }

  /* -------------------------------------- */
  /* THRILLER                               */
  /* -------------------------------------- */

  if (
    goals(context) >= 5 ||
    context.momentum.swings.length >= 3
  ) {

    return {
      title: "End-to-end thriller delivers drama",
      subtitle:
        "Momentum shifted repeatedly throughout the match.",
      category: "Thriller",
      confidence: 0.92,
      generatedAt: new Date().toISOString(),
    };

  }

  /* -------------------------------------- */
  /* TACTICAL BATTLE                        */
  /* -------------------------------------- */

  if (
    context.formations.home.length > 0 ||
    context.formations.away.length > 0
  ) {

    return {
      title: "Tactical battle decides the contest",
      subtitle:
        "Both managers adapted throughout the game.",
      category: "Tactical Battle",
      confidence: 0.88,
      generatedAt: new Date().toISOString(),
    };

  }

  /* -------------------------------------- */
  /* BALANCED MATCH                         */
  /* -------------------------------------- */

  return {

    title:
      winner(context.intelligence) === "draw"
        ? `${home.information.name} and ${away.information.name} share the points`
        : `${winnerName(context)} edge past ${loserName(context)}`,

    subtitle:
      "Neither side established sustained dominance for long periods.",

    category: "Balanced Match",

    confidence: 0.80,

    generatedAt: new Date().toISOString(),

  };

}