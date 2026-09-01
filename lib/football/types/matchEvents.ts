// lib/football/types/matchEvents.ts

/* ==========================================================
   VERSION
========================================================== */

export const MOMENTUM_ENGINE_VERSION = "1.1.0";

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
   EVENT TYPES
========================================================== */

export type MatchEventType =
  | "goal"
  | "own_goal"
  | "penalty_goal"
  | "penalty_miss"
  | "big_chance"
  | "shot_on_target"
  | "shot_off_target"
  | "red_card"
  | "yellow_card"
  | "substitution"
  | "corner"
  | "var"
  | "injury";

/* ==========================================================
   STANDARD MATCH EVENT
========================================================== */

export interface MatchEvent {

  id: string;

  minute: number;

  addedTime?: number;

  team: "home" | "away";

  type: MatchEventType;

  player?: string;

  assist?: string;

  description: string;

}

/* ==========================================================
   MOMENTUM EVENT
========================================================== */

export interface MatchMomentEvent {

  minute: number;

  team: "home" | "away";

  type: MatchEventType;

  impact?: number;

}

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
   MATCH EVENTS COLLECTION
========================================================== */

export interface MatchEvents {

  generatedAt: string;

  events: MatchEvent[];

  goals: MatchEvent[];

  cards: MatchEvent[];

  substitutions: MatchEvent[];

  varEvents: MatchEvent[];

}