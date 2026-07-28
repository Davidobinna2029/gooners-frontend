// lib/football/intelligence/momentumEngine.ts

import type { MatchIntelligence } from "./matchIntelligence";

/* ==========================================================
   VERSION / CONFIDENCE
========================================================== */

const MOMENTUM_ENGINE_VERSION = "1.1.0";

/**
 * Confidence is lower when no event timeline is supplied, because the
 * engine then has nothing to differentiate one window from another
 * besides the (identical, whole-match) MatchIntelligence metrics.
 * See the note above buildTimeline() for details.
 */
const STATIC_ESTIMATE_CONFIDENCE = 0.5;
const EVENT_AWARE_CONFIDENCE = 0.85;

/* ==========================================================
   TEAM
========================================================== */

export type MomentumTeam =
  | "home"
  | "away"
  | "balanced";

/* ==========================================================
   PRESSURE LEVEL
========================================================== */

export type PressureLevel =
  | "low"
  | "medium"
  | "high"
  | "extreme";

/* ==========================================================
   MATCH EVENTS

   Momentum should ultimately be driven by what actually happened
   in the match, not just the final aggregate metrics. This is a
   provisional shape — swap it for your real event feed's type
   once `MatchData` exposes one, and update EVENT_IMPACT to taste.
========================================================== */

export type MomentumEventType =
  | "goal"
  | "big_chance"
  | "shot_on_target"
  | "shot_off_target"
  | "red_card"
  | "yellow_card"
  | "substitution"
  | "var_review";

export interface MatchMomentEvent {
  minute: number;
  team: "home" | "away";
  type: MomentumEventType;
  /** Overrides the default EVENT_IMPACT weight for this one event. */
  impact?: number;
}

/**
 * How much each event type shifts a window's momentum score toward
 * the team it happened for. Tune freely — these are starting points,
 * not measured values.
 */
const EVENT_IMPACT: Record<MomentumEventType, number> = {
  goal: 25,
  big_chance: 12,
  shot_on_target: 6,
  shot_off_target: 3,
  red_card: 20,
  yellow_card: 4,
  substitution: 2,
  var_review: 3,
};

/* ==========================================================
   MOMENTUM WINDOW
========================================================== */

export interface MomentumWindow {

  minuteStart: number;

  minuteEnd: number;

  dominantTeam: MomentumTeam;

  intensity: number;

  reason: string;

}

/* ==========================================================
   PRESSURE WAVE
========================================================== */

export interface PressureWave {

  team: MomentumTeam;

  minuteStart: number;

  minuteEnd: number;

  level: PressureLevel;

  intensity: number;

  description: string;

}

/* ==========================================================
   MOMENTUM SHIFT
========================================================== */

export interface MomentumShift {

  minute: number;

  from: MomentumTeam;

  to: MomentumTeam;

  reason: string;

}

/* ==========================================================
   MATCH MOMENTUM
========================================================== */

export interface MatchMomentum {

  generatedAt: string;

  version: string;

  confidence: number;

  timeline: MomentumWindow[];

  pressureWaves: PressureWave[];

  swings: MomentumShift[];

  overallWinner: MomentumTeam;

}

/* ==========================================================
   CONTEXT
========================================================== */

export interface MomentumContext {

  intelligence: MatchIntelligence;

}

/* ==========================================================
   HELPERS
========================================================== */

function clamp(

  value: number,

  min = 0,

  max = 100

): number {

  return Math.max(
    min,
    Math.min(max, value)
  );

}

function getPressureLevel(
  intensity: number
): PressureLevel {

  if (intensity >= 90)
    return "extreme";

  if (intensity >= 75)
    return "high";

  if (intensity >= 50)
    return "medium";

  return "low";

}

/* ==========================================================
   MOMENTUM SCORE

   Weights are explicit so tuning "how much does a spell of
   dangerous attacks matter vs. raw possession control" is a
   one-line change here, not a rebalancing of an average() call.
   dangerousAttacks is a raw count rather than a 0-100 index, so
   it gets a flat multiplier instead of a fractional weight.
========================================================== */

const MOMENTUM_WEIGHTS = {
  controlIndex: 0.35,
  fieldTilt: 0.25,
  dangerousAttacks: 2,
  tempo: 0.15,
} as const;

function calculateMomentumScore(

  controlIndex: number,

  fieldTilt: number,

  dangerousAttacks: number,

  tempo: number

): number {

  const score =
    controlIndex * MOMENTUM_WEIGHTS.controlIndex +
    fieldTilt * MOMENTUM_WEIGHTS.fieldTilt +
    dangerousAttacks * MOMENTUM_WEIGHTS.dangerousAttacks +
    tempo * MOMENTUM_WEIGHTS.tempo;

  return clamp(score);

}

/* ==========================================================
   EVENT IMPACT

   Sums the momentum boost each team earns from events that fall
   inside a given window, so goals/cards/big chances can actually
   move the needle instead of every window looking the same.
========================================================== */

function sumEventImpact(
  events: MatchMomentEvent[],
  team: "home" | "away"
): number {

  return events
    .filter(event => event.team === team)
    .reduce(
      (total, event) =>
        total + (event.impact ?? EVENT_IMPACT[event.type]),
      0
    );

}

/* ==========================================================
   DOMINANCE DESCRIPTION

   Names the actual teams and picks the metric that contributed
   most to the swing, so this reads like editorial copy ("Arsenal
   pinned Chelsea inside their defensive third") instead of a
   generic template ("Home side controlled possession").
========================================================== */

interface DominanceBreakdown {
  controlIndex: number;
  fieldTilt: number;
  dangerousAttacks: number;
  tempo: number;
}

function describeDominantPhase(
  teamName: string,
  opponentName: string,
  breakdown: DominanceBreakdown
): string {

  const weighted = {
    controlIndex: breakdown.controlIndex * MOMENTUM_WEIGHTS.controlIndex,
    fieldTilt: breakdown.fieldTilt * MOMENTUM_WEIGHTS.fieldTilt,
    dangerousAttacks: breakdown.dangerousAttacks * MOMENTUM_WEIGHTS.dangerousAttacks,
    tempo: breakdown.tempo * MOMENTUM_WEIGHTS.tempo,
  };

  const leadingFactor = (
    Object.entries(weighted) as Array<[keyof DominanceBreakdown, number]>
  ).sort((a, b) => b[1] - a[1])[0][0];

  switch (leadingFactor) {

    case "fieldTilt":
      return `${teamName} pinned ${opponentName} inside their defensive third.`;

    case "dangerousAttacks":
      return `${teamName} produced a spell of dangerous attacking phases against ${opponentName}.`;

    case "tempo":
      return `${teamName} raised the tempo and stretched ${opponentName}.`;

    case "controlIndex":
    default:
      return `${teamName} took control of the game's rhythm against ${opponentName}.`;

  }

}

/* ==========================================================
   MATCH SEGMENTS
========================================================== */

export const MOMENTUM_SEGMENTS = [
  { start: 0, end: 15 },
  { start: 15, end: 30 },
  { start: 30, end: 45 },
  { start: 45, end: 60 },
  { start: 60, end: 75 },
  { start: 75, end: 90 },
];

/* ==========================================================
   THRESHOLDS
========================================================== */

const DOMINANCE_THRESHOLD = 8;

const PRESSURE_THRESHOLD = 70;

/* ==========================================================
   BUILD WINDOW
========================================================== */

function buildWindow(
  minuteStart: number,
  minuteEnd: number,
  context: MomentumContext,
  events: MatchMomentEvent[]
): MomentumWindow {

  const { intelligence } = context;

  const homeName = intelligence.home.information.name;
  const awayName = intelligence.away.information.name;

  const homeBase =
    calculateMomentumScore(
      intelligence.home.dominance.controlIndex,
      intelligence.home.dominance.fieldTilt,
      intelligence.home.dominance.dangerousAttacks,
      intelligence.home.dominance.tempoIndex
    );

  const awayBase =
    calculateMomentumScore(
      intelligence.away.dominance.controlIndex,
      intelligence.away.dominance.fieldTilt,
      intelligence.away.dominance.dangerousAttacks,
      intelligence.away.dominance.tempoIndex
    );

  const windowEvents = events.filter(
    event => event.minute >= minuteStart && event.minute < minuteEnd
  );

  const homeScore = clamp(homeBase + sumEventImpact(windowEvents, "home"));
  const awayScore = clamp(awayBase + sumEventImpact(windowEvents, "away"));

  const difference = Math.abs(homeScore - awayScore);

  let dominantTeam: MomentumTeam = "balanced";

  if (difference >= DOMINANCE_THRESHOLD) {
    dominantTeam =
      homeScore > awayScore
        ? "home"
        : "away";
  }

  const intensity = Math.max(homeScore, awayScore);

  let reason = "Balanced phase of play.";

  if (dominantTeam === "home") {
    reason = describeDominantPhase(homeName, awayName, {
      controlIndex: intelligence.home.dominance.controlIndex,
      fieldTilt: intelligence.home.dominance.fieldTilt,
      dangerousAttacks: intelligence.home.dominance.dangerousAttacks,
      tempo: intelligence.home.dominance.tempoIndex,
    });
  }

  if (dominantTeam === "away") {
    reason = describeDominantPhase(awayName, homeName, {
      controlIndex: intelligence.away.dominance.controlIndex,
      fieldTilt: intelligence.away.dominance.fieldTilt,
      dangerousAttacks: intelligence.away.dominance.dangerousAttacks,
      tempo: intelligence.away.dominance.tempoIndex,
    });
  }

  return {
    minuteStart,
    minuteEnd,
    dominantTeam,
    intensity,
    reason,
  };

}

/* ==========================================================
   BUILD TIMELINE

   IMPORTANT: MatchIntelligence carries whole-match aggregates,
   not per-segment ones — there's no "0-15 controlIndex" in the
   data model yet. Without an event timeline, every window's base
   score is therefore identical, and only `events` differentiates
   them. Pass a MatchMomentEvent[] once your event feed exists;
   until then, timeline shape mainly reflects the flat match-wide
   averages rather than genuine minute-by-minute momentum.
========================================================== */

function buildTimeline(
  context: MomentumContext,
  events: MatchMomentEvent[]
): MomentumWindow[] {

  if (!events.length) {
    console.warn(
      "[MomentumEngine] No match events supplied — momentum timeline " +
      "is derived from whole-match aggregates and will look flat. " +
      "Pass MatchMomentEvent[] for genuine minute-by-minute momentum."
    );
  }

  return MOMENTUM_SEGMENTS.map(segment =>
    buildWindow(
      segment.start,
      segment.end,
      context,
      events
    )
  );

}

/* ==========================================================
   PRESSURE WAVES
========================================================== */

function detectPressureWaves(
  timeline: MomentumWindow[]
): PressureWave[] {

  return timeline
    .filter(window => window.intensity >= PRESSURE_THRESHOLD)
    .map(window => ({
      team: window.dominantTeam,
      minuteStart: window.minuteStart,
      minuteEnd: window.minuteEnd,
      intensity: window.intensity,
      level: getPressureLevel(window.intensity),
      description: window.reason,
    }));

}

/* ==========================================================
   MOMENTUM SHIFTS
========================================================== */

function detectMomentumShifts(
  timeline: MomentumWindow[]
): MomentumShift[] {

  const shifts: MomentumShift[] = [];

  for (let i = 1; i < timeline.length; i++) {

    const previous =
      timeline[i - 1];

    const current =
      timeline[i];

    if (
      previous.dominantTeam !==
      current.dominantTeam
    ) {

      if (
        previous.dominantTeam === "balanced" ||
        current.dominantTeam === "balanced"
      ) {
        continue;
      }

      shifts.push({
        minute:
          current.minuteStart,
        from:
          previous.dominantTeam,
        to:
          current.dominantTeam,
        reason:
          current.reason,
      });

    }

  }

  return shifts;

}

/* ==========================================================
   OVERALL WINNER

   Weighted by pressure level rather than a flat window count, so
   two "extreme" windows outweigh five "low" ones — a team that
   bosses two spells completely should be recognised over one that
   nudges ahead for most of a placid match.
========================================================== */

const WINNER_POINTS: Record<PressureLevel, number> = {
  extreme: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function determineOverallWinner(
  timeline: MomentumWindow[]
): MomentumTeam {

  let home = 0;
  let away = 0;

  for (const window of timeline) {

    if (window.dominantTeam === "balanced") {
      continue;
    }

    const points = WINNER_POINTS[getPressureLevel(window.intensity)];

    if (window.dominantTeam === "home") {
      home += points;
    } else {
      away += points;
    }

  }

  if (
    Math.abs(home - away) <= 1
  ) {
    return "balanced";
  }

  return home > away
    ? "home"
    : "away";

}

/* ==========================================================
   PUBLIC API
========================================================== */

export function buildMatchMomentum(
  intelligence: MatchIntelligence,
  events: MatchMomentEvent[] = []
): MatchMomentum {

  const context: MomentumContext = {
    intelligence,
  };

  const timeline =
    buildTimeline(context, events);

  const pressureWaves =
    detectPressureWaves(
      timeline
    );

  const swings =
    detectMomentumShifts(
      timeline
    );

  return {
    generatedAt: new Date().toISOString(),
    version: MOMENTUM_ENGINE_VERSION,
    confidence: events.length
      ? EVENT_AWARE_CONFIDENCE
      : STATIC_ESTIMATE_CONFIDENCE,
    timeline,
    pressureWaves,
    swings,
    overallWinner:
      determineOverallWinner(
        timeline
      ),
  };

}