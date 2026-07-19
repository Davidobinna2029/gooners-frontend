import type {
  ID,
  TeamSide,
} from "./common";

export type FootballEventType =
  | "goal"
  | "own_goal"
  | "penalty_goal"
  | "penalty_miss"
  | "yellow_card"
  | "red_card"
  | "second_yellow"
  | "substitution"
  | "corner"
  | "offside"
  | "shot"
  | "save"
  | "foul"
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
}