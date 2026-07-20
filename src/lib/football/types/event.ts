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
  | "through_ball"
  | "switch_play"
  | "progressive_pass"

  | "carry"
  | "carry_end"
  | "dribble"
  | "take_on"
  | "progressive_carry"

  | "tackle"
  | "interception"
  | "clearance"
  | "block"
  | "recovery"
  | "ball_recovery"
  | "duel_won"

  | "press"
  | "pressure_regain"

  | "turnover"

  | "corner"
  | "offside"
  | "foul"

  | "yellow_card"
  | "red_card"
  | "second_yellow"

  | "substitution"
  | "formation_change"

  | "counter_attack"

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

  /**
   * Match period
   * 1 = First Half
   * 2 = Second Half
   * 3 = Extra Time 1
   * 4 = Extra Time 2
   */
  period?: 1 | 2 | 3 | 4;

  playerId?: ID;

  playerName?: string;

  assistPlayerId?: ID;

  assistPlayerName?: string;

  /**
   * Receiver of a pass
   */
  receiverId?: ID;

  receiverName?: string;

  teamId?: ID;

  side?: TeamSide;

  detail?: string;

  /**
   * Formation after change.
   * Used only for formation_change.
   */
  formation?: string;

  /**
   * Player replaced during substitution.
   */
  replacedPlayerId?: ID;

  replacedPlayerName?: string;

  /**
   * Start location
   * Normalized pitch coordinates (0–100)
   */
  x?: number;

  y?: number;

  /**
   * End location
   * Normalized pitch coordinates (0–100)
   */
  endX?: number;

  endY?: number;

  /**
   * Event outcome
   */
  successful?: boolean;

  /**
   * Outcome of defensive action
   */
  outcome?:
    | "won"
    | "lost"
    | "blocked"
    | "saved";

  /**
   * Tactical zone
   */
  zone?:
    | "defensive_third"
    | "middle_third"
    | "final_third"
    | "left_flank"
    | "right_flank"
    | "half_space_left"
    | "half_space_right"
    | "box";

  /**
   * Distance travelled (meters)
   */
  distance?: number;

  /**
   * Speed (m/s)
   */
  speed?: number;

  /**
   * Possession sequence identifier
   */
  possessionId?: ID;

  /**
   * Possession duration (seconds)
   */
  possessionDuration?: number;

  /**
   * Player applying pressure
   */
  pressure?: boolean;

  /**
   * Player performing action while under pressure
   */
  underPressure?: boolean;

  /**
   * Body part used
   */
  bodyPart?:
    | "left_foot"
    | "right_foot"
    | "head"
    | "other";

  /**
   * Pass height
   */
  passHeight?:
    | "ground"
    | "low"
    | "high";

  /**
   * Pass length (meters)
   */
  passLength?: number;

  /**
   * Expected Goals
   */
  xG?: number;

  /**
   * Expected Threat
   */
  xT?: number;

  /**
   * Progressive action flag
   */
  progressive?: boolean;

}