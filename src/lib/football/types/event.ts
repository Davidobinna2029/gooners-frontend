// src/lib/football/types/event.ts

import type {
  ID,
  TeamSide,
} from "./common";

export type FootballEventType =
  | "goal"
  | "own_goal"
  | "penalty_goal"
  | "penalty_miss"

  | "assist"

  | "shot"
  | "shot_on_target"
  | "shot_off_target"
  | "blocked_shot"

  | "save"

  | "pass"
  | "successful_pass"
  | "key_pass"
  | "cross"

  | "tackle"
  | "interception"
  | "clearance"
  | "block"
  | "recovery"
  | "duel_won"

  | "corner"
  | "offside"
  | "foul"

  | "yellow_card"
  | "red_card"
  | "second_yellow"

  | "substitution"
  | "formation_change"

  | "var"
  | "injury"

  | "kickoff"
  | "halftime"
  | "fulltime";

export interface FootballEvent {

  id: ID;

  type: FootballEventType;

  minute: number;

  extraMinute?: number;

  playerId?: ID;

  playerName?: string;

  assistPlayerId?: ID;

  assistPlayerName?: string;

  teamId?: ID;

  side?: TeamSide;

  detail?: string;

  /**
   * Used only for formation_change events.
   * Example:
   * "4-3-3"
   * "4-2-3-1"
   * "3-5-2"
   */
  formation?: string;

}