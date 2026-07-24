import type { MatchIntelligence } from "../intelligence/matchIntelligence";
import type { TacticalInsight } from "../intelligence/tacticalInsightsEngine";
import type { MatchMomentum } from "../intelligence/momentumEngine";
import type { MatchFormations } from "../intelligence/formationShiftEngine";

/* ==========================================================
   PROMPT INPUT
========================================================== */

export interface PromptBuilderInput {
  intelligence: MatchIntelligence;
  tacticalInsights: TacticalInsight[];
  momentum: MatchMomentum;
  formations: MatchFormations;
}

/* ==========================================================
   BUILT PROMPT
========================================================== */

export interface BuiltPrompt {
  system: string;
  user: string;
}

/* ==========================================================
   HELPERS
========================================================== */

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/* ==========================================================
   TACTICAL INSIGHTS
========================================================== */

function buildTacticalSection(insights: TacticalInsight[]): string {
  if (!insights.length) {
    return "No major tactical insights detected.";
  }
  return insights
    .map(
      insight =>
        `• ${insight.title} (${formatConfidence(
          insight.confidence
        )}) — ${insight.description}`
    )
    .join("\n");
}

/* ==========================================================
   MOMENTUM TIMELINE
========================================================== */

function buildMomentumSection(momentum: MatchMomentum): string {
  if (!momentum.timeline.length) {
    return "No momentum timeline available.";
  }
  return momentum.timeline
    .map(
      window =>
        `${window.minuteStart}'-${window.minuteEnd}' : ${window.dominantTeam.toUpperCase()} (${window.intensity.toFixed(
          0
        )})`
    )
    .join("\n");
}

/* ==========================================================
   FORMATION SHIFTS
========================================================== */

function buildFormationSection(formations: MatchFormations): string {
  const lines: string[] = [];
  for (const shift of formations.home) {
    lines.push(
      `HOME ${shift.minute}' : ${shift.fromFormation} → ${shift.toFormation} (${shift.reason})`
    );
  }
  for (const shift of formations.away) {
    lines.push(
      `AWAY ${shift.minute}' : ${shift.fromFormation} → ${shift.toFormation} (${shift.reason})`
    );
  }
  if (!lines.length) {
    return "No major formation changes detected.";
  }
  return lines.join("\n");
}

/* ==========================================================
   MATCH INTELLIGENCE SUMMARY
========================================================== */

function buildMatchSummary(intelligence: MatchIntelligence): string {
  return [
    `HOME CONTROL INDEX: ${intelligence.home.dominance.controlIndex.toFixed(1)}`,
    `AWAY CONTROL INDEX: ${intelligence.away.dominance.controlIndex.toFixed(1)}`,
    "",
    `HOME POSSESSION VALUE: ${formatPercent(
      intelligence.home.dominance.possessionValue
    )}`,
    `AWAY POSSESSION VALUE: ${formatPercent(
      intelligence.away.dominance.possessionValue
    )}`,
    "",
    `HOME FIELD TILT: ${formatPercent(
      intelligence.home.dominance.fieldTilt
    )}`,
    `AWAY FIELD TILT: ${formatPercent(
      intelligence.away.dominance.fieldTilt
    )}`,
    "",
    `HOME TEMPO: ${intelligence.home.dominance.tempoIndex.toFixed(0)}`,
    `AWAY TEMPO: ${intelligence.away.dominance.tempoIndex.toFixed(0)}`,
    "",
    `HOME DANGEROUS ATTACKS: ${intelligence.home.dominance.dangerousAttacks}`,
    `AWAY DANGEROUS ATTACKS: ${intelligence.away.dominance.dangerousAttacks}`,
  ].join("\n");
}

/* ==========================================================
   SYSTEM PROMPT
========================================================== */

function buildSystemPrompt(): string {
  return `
You are an elite football tactical analyst.
Your job is to produce a professional match analysis.
Rules:
- Never invent statistics.
- Use only supplied intelligence.
- Explain tactical behaviour.
- Mention momentum swings.
- Mention formation changes.
- Explain why the match evolved.
- Write naturally.
- Avoid repetition.
- Sound like a professional analyst rather than a commentator.
`.trim();
}

/* ==========================================================
   USER PROMPT
========================================================== */

function buildUserPrompt(input: PromptBuilderInput): string {
  return [
    "# MATCH INTELLIGENCE",
    buildMatchSummary(input.intelligence),
    "",
    "# TACTICAL INSIGHTS",
    buildTacticalSection(input.tacticalInsights),
    "",
    "# MOMENTUM",
    buildMomentumSection(input.momentum),
    "",
    "# FORMATION SHIFTS",
    buildFormationSection(input.formations),
    "",
    "# TASK",
    "Write a professional tactical match analysis using only the supplied football intelligence.",
    "Explain:",
    "- overall match flow",
    "- tactical battles",
    "- momentum swings",
    "- attacking patterns",
    "- defensive organisation",
    "- formation adjustments",
    "- why the result unfolded as it did.",
  ].join("\n");
}

/* ==========================================================
   PUBLIC API
========================================================== */

export function buildPrompt(input: PromptBuilderInput): BuiltPrompt {
  return {
    system: buildSystemPrompt(),
    user: buildUserPrompt(input),
  };
}