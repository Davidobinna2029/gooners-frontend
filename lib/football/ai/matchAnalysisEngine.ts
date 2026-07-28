// lib/football/ai/matchAnalysisEngine.ts

import type { MatchViewModel } from "@/lib/football/models/matchViewModel";
import type { MatchIntelligence } from "@/lib/football/intelligence/matchIntelligence";
import type { MatchMomentum } from "@/lib/football/intelligence/momentumEngine";
import type { MatchFormations } from "@/lib/football/intelligence/formationShiftEngine";
import type { MatchTacticalInsights } from "@/lib/football/intelligence/tacticalInsights";
import type { PlayerRankings } from "@/lib/football/intelligence/player";
import { buildPlayerAwards } from "@/lib/football/ai/playerAwardsEngine";

/* ==========================================================
   MATCH ANALYSIS
========================================================== */

export interface MatchAnalysis {

  headline: string;

  summary: string;

  keyFindings: string[];

  tacticalStory: string[];

  strengths: string[];

  weaknesses: string[];

  turningPoints: string[];

  playerHighlights: string[];

  coachingAssessment: string[];

  verdict: string;

}

/* ==========================================================
   CONTEXT

   Field names match what matchAnalysisService.ts actually
   builds and passes in — match / intelligence / tacticalInsights /
   momentum / formationShifts — rather than an independent naming
   scheme (this previously had `formations` and `tactical`, which
   is what broke the build: matchAnalysisService.ts has never
   called it anything but `formationShifts` and `tacticalInsights`).
========================================================== */

export interface MatchAnalysisContext {

  match: MatchViewModel;

  intelligence: MatchIntelligence;

  momentum: MatchMomentum;

  formationShifts: MatchFormations;

  /**
   * Both sides' tactical insights, grouped into
   * attacking/defending/transition/possession. Feeds
   * buildStrengths/buildWeaknesses (via each insight's id fragment)
   * and buildTacticalStory (via topTacticalNarrative below).
   */
  tacticalInsights: MatchTacticalInsights;

  /**
   * Match-wide superlatives (Man of the Match, Best Defender,
   * etc.) computed over the combined home + away player pool —
   * see buildPlayerRankings(). Feeds buildPlayerHighlights below
   * instead of the old arbitrary "first 3 home players" slice.
   */
  playerRankings: PlayerRankings;

}

/* ==========================================================
   HELPERS
========================================================== */

/**
 * Pulls insights matching an id fragment (e.g. "-strength-",
 * "-weakness-") out of a team's TacticalInsights, across all four
 * buckets. detectStrengths/detectWeaknesses tag their ids with
 * these fragments specifically so this file can find them again
 * without recomputing the same thresholds by hand.
 */
function collectInsightsByIdFragment(
  insights: import("@/lib/football/intelligence/tacticalInsights").TacticalInsights,
  fragment: string
) {
  return [
    ...insights.attacking,
    ...insights.defending,
    ...insights.transition,
    ...insights.possession,
  ].filter(insight => insight.id.includes(fragment));
}

/**
 * Highest-confidence tactical reads for a team, excluding the
 * strength/weakness entries (those already have their own
 * sections) — used to narrate playing style in buildTacticalStory.
 */
function topTacticalNarrative(
  insights: import("@/lib/football/intelligence/tacticalInsights").TacticalInsights,
  limit: number
): string[] {
  return [
    ...insights.attacking,
    ...insights.defending,
    ...insights.transition,
    ...insights.possession,
  ]
    .filter(
      insight =>
        !insight.id.includes("-strength-") &&
        !insight.id.includes("-weakness-")
    )
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit)
    .map(insight => insight.description);
}

function winner(
  intelligence: MatchIntelligence
): "home" | "away" | "draw" {

  if (
    intelligence.score.home >
    intelligence.score.away
  ) {
    return "home";
  }

  if (
    intelligence.score.away >
    intelligence.score.home
  ) {
    return "away";
  }

  return "draw";

}

/* ==========================================================
   HEADLINE
========================================================== */

function buildHeadline(
  context: MatchAnalysisContext
): string {

  const result =
    winner(context.intelligence);

  const home =
    context.intelligence.home.information.name;

  const away =
    context.intelligence.away.information.name;

  if (result === "home") {
    return `${home} controlled the match against ${away}`;
  }

  if (result === "away") {
    return `${away} outperformed ${home}`;
  }

  return `${home} and ${away} shared the points`;

}

/* ==========================================================
   SUMMARY
========================================================== */

function buildSummary(
  context: MatchAnalysisContext
): string {

  const dominant =
    context.momentum.overallWinner;

  if (dominant === "home") {
    return "The home side controlled the majority of the match through sustained territorial dominance.";
  }

  if (dominant === "away") {
    return "The away side imposed their tactical structure and dictated long periods of play.";
  }

  return "Neither side established sustained control for long periods.";

}

/* ==========================================================
   KEY FINDINGS
========================================================== */

function buildKeyFindings(
  context: MatchAnalysisContext
): string[] {

  const findings: string[] = [];

  findings.push(
    `Possession: ${context.intelligence.home.dominance.possessionValue}% vs ${context.intelligence.away.dominance.possessionValue}%`
  );

  findings.push(
    `Control Index: ${context.intelligence.home.dominance.controlIndex} vs ${context.intelligence.away.dominance.controlIndex}`
  );

  findings.push(
    `Dangerous Attacks: ${context.intelligence.home.dominance.dangerousAttacks} vs ${context.intelligence.away.dominance.dangerousAttacks}`
  );

  return findings;

}

/* ==========================================================
   TACTICAL STORY
========================================================== */

function buildTacticalStory(
  context: MatchAnalysisContext
): string[] {

  const formationLines = [

    ...context.formationShifts.home.map(shift => ({
      minute: shift.minute,
      line: `${shift.minute}' — ${context.intelligence.home.information.name} shifted from ${shift.fromFormation} to ${shift.toFormation}: ${shift.reason}`,
    })),

    ...context.formationShifts.away.map(shift => ({
      minute: shift.minute,
      line: `${shift.minute}' — ${context.intelligence.away.information.name} shifted from ${shift.fromFormation} to ${shift.toFormation}: ${shift.reason}`,
    })),

  ]
    .sort((a, b) => a.minute - b.minute)
    .map(entry => entry.line);

  const narrativeLines = [
    ...topTacticalNarrative(context.tacticalInsights.home, 2),
    ...topTacticalNarrative(context.tacticalInsights.away, 2),
  ];

  return [...formationLines, ...narrativeLines];

}

/* ==========================================================
   STRENGTHS

   Both sides now, sourced from tacticalInsights' own
   detectStrengths() output (via the "-strength-" id fragment)
   rather than re-deriving weaker ad-hoc threshold checks here —
   one source of truth for what counts as a strength.
========================================================== */

function buildStrengths(
  context: MatchAnalysisContext
): string[] {

  const homeName = context.intelligence.home.information.name;
  const awayName = context.intelligence.away.information.name;

  const home = collectInsightsByIdFragment(
    context.tacticalInsights.home,
    "-strength-"
  ).map(insight => `${homeName}: ${insight.description}`);

  const away = collectInsightsByIdFragment(
    context.tacticalInsights.away,
    "-strength-"
  ).map(insight => `${awayName}: ${insight.description}`);

  return [...home, ...away];

}

/* ==========================================================
   WEAKNESSES
========================================================== */

function buildWeaknesses(
  context: MatchAnalysisContext
): string[] {

  const homeName = context.intelligence.home.information.name;
  const awayName = context.intelligence.away.information.name;

  const home = collectInsightsByIdFragment(
    context.tacticalInsights.home,
    "-weakness-"
  ).map(insight => `${homeName}: ${insight.description}`);

  const away = collectInsightsByIdFragment(
    context.tacticalInsights.away,
    "-weakness-"
  ).map(insight => `${awayName}: ${insight.description}`);

  return [...home, ...away];

}

/* ==========================================================
   TURNING POINTS
========================================================== */

function buildTurningPoints(
  context: MatchAnalysisContext
): string[] {

  return context.momentum.swings.map(
    swing =>
      `${swing.minute}' — Momentum shifted from ${swing.from} to ${swing.to}.`
  );

}

/* ==========================================================
   PLAYER HIGHLIGHTS

   Sourced from playerAwardsEngine.ts's editorial descriptions
   rather than reformatting PlayerRankings here directly — one
   place (buildPlayerAwards) owns "ranking → sentence," this file
   just consumes it, same detection/narrative split used for
   strengths/weaknesses above.
========================================================== */

function buildPlayerHighlights(
  context: MatchAnalysisContext
): string[] {

  return buildPlayerAwards(context.playerRankings)
    .map(award => `${award.title}: ${award.description}`);

}

/* ==========================================================
   COACHING
========================================================== */

function buildCoachingAssessment(
  context: MatchAnalysisContext
): string[] {

  const assessment: string[] = [];

  if (
    context.formationShifts.home.length
  ) {

    assessment.push(
      "Formation adjustments positively influenced the game."
    );

  }

  if (
    context.formationShifts.away.length
  ) {

    assessment.push(
      "Opposition responded with tactical adjustments."
    );

  }

  return assessment;

}

/* ==========================================================
   VERDICT
========================================================== */

function buildVerdict(
  context: MatchAnalysisContext
): string {

  switch (
    context.momentum.overallWinner
  ) {

    case "home":
      return "Home side deserved the stronger result based on sustained control.";

    case "away":
      return "Away side executed the better tactical game plan.";

    default:
      return "The match remained balanced throughout.";

  }

}

/* ==========================================================
   PUBLIC API
========================================================== */

export function buildMatchAnalysis(
  context: MatchAnalysisContext
): MatchAnalysis {

  return {

    headline:
      buildHeadline(context),

    summary:
      buildSummary(context),

    keyFindings:
      buildKeyFindings(context),

    tacticalStory:
      buildTacticalStory(context),

    strengths:
      buildStrengths(context),

    weaknesses:
      buildWeaknesses(context),

    turningPoints:
      buildTurningPoints(context),

    playerHighlights:
      buildPlayerHighlights(context),

    coachingAssessment:
      buildCoachingAssessment(context),

    verdict:
      buildVerdict(context),

  };

}