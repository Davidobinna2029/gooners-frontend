export type MatchEventType =
  | "GOAL"
  | "YELLOW_CARD"
  | "RED_CARD"
  | "SUBSTITUTION"
  | "SHOT"
  | "CORNER"
  | "FREE_KICK"
  | "PENALTY";

export interface RawMatchEvent {
  id: string;

  type: string;

  minute?: number;

  player?: {
    id: number;
    name: string;
  };

  team?: {
    id: number;
    name: string;
  };

  detail?: string;
}


export interface NormalizedMatchEvent {
  id: string;

  type: MatchEventType;

  minute?: number;

  playerId?: number;

  playerName?: string;

  teamId?: number;

  teamName?: string;

  detail?: string;
}