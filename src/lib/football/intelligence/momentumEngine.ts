import type { MatchIntelligence } from "./matchIntelligence";

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

function average(

  ...values: number[]

): number {

  if (!values.length) return 0;

  return (
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length
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
========================================================== */

function calculateMomentumScore(

  controlIndex: number,

  fieldTilt: number,

  dangerousAttacks: number,

  tempo: number

): number {

  return clamp(
    average(
      controlIndex,
      fieldTilt,
      dangerousAttacks * 4,
      tempo
    )
  );

}

/* ==========================================================
   MATCH SEGMENTS
========================================================== */

const SEGMENTS = [
  { start: 0, end: 15 },
  { start: 15, end: 30 },
  { start: 30, end: 45 },
  { start: 45, end: 60 },
  { start: 60, end: 75 },
  { start: 75, end: 90 },
];

/* ==========================================================
   BUILD WINDOW
========================================================== */

function buildWindow(
  minuteStart: number,
  minuteEnd: number,
  context: MomentumContext
): MomentumWindow {

  const { intelligence } = context;

  const homeScore =
    calculateMomentumScore(
      intelligence.home.dominance.controlIndex,
      intelligence.home.dominance.fieldTilt,
      intelligence.home.dominance.dangerousAttacks,
      intelligence.home.dominance.tempoIndex
    );

  const awayScore =
    calculateMomentumScore(
      intelligence.away.dominance.controlIndex,
      intelligence.away.dominance.fieldTilt,
      intelligence.away.dominance.dangerousAttacks,
      intelligence.away.dominance.tempoIndex
    );

  const difference =
    Math.abs(homeScore - awayScore);

  let dominantTeam: MomentumTeam = "balanced";

  if (difference >= 8) {
    dominantTeam =
      homeScore > awayScore
        ? "home"
        : "away";
  }

  let reason = "Balanced phase of play.";

  if (dominantTeam === "home") {
    reason =
      "Home side controlled possession and territory.";
  }

  if (dominantTeam === "away") {
    reason =
      "Away side controlled possession and territory.";
  }

  return {
    minuteStart,
    minuteEnd,
    dominantTeam,
    intensity:
      Math.max(homeScore, awayScore),
    reason,
  };

}

/* ==========================================================
   BUILD TIMELINE
========================================================== */

function buildTimeline(
  context: MomentumContext
): MomentumWindow[] {

  return SEGMENTS.map(segment =>
    buildWindow(
      segment.start,
      segment.end,
      context
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
    .filter(window => window.intensity >= 70)
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
========================================================== */

function determineOverallWinner(
  timeline: MomentumWindow[]
): MomentumTeam {

  let home = 0;
  let away = 0;

  for (const window of timeline) {

    if (
      window.dominantTeam === "home"
    ) {
      home++;
    }

    if (
      window.dominantTeam === "away"
    ) {
      away++;
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
  intelligence: MatchIntelligence
): MatchMomentum {

  const context: MomentumContext = {
    intelligence,
  };

  const timeline =
    buildTimeline(context);

  const pressureWaves =
    detectPressureWaves(
      timeline
    );

  const swings =
    detectMomentumShifts(
      timeline
    );

  return {
    timeline,
    pressureWaves,
    swings,
    overallWinner:
      determineOverallWinner(
        timeline
      ),
  };

}