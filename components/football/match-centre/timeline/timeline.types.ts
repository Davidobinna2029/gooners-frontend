export type TimelineEventType =
  | "goal"
  | "own_goal"
  | "penalty_goal"
  | "penalty_miss"
  | "yellow_card"
  | "red_card"
  | "second_yellow"
  | "substitution"
  | "var"
  | "injury"
  | "kickoff"
  | "half_time"
  | "full_time";

export interface TimelinePlayer {
  id?: number;
  name: string;
}

export interface TimelineEvent {
  id: string;

  minute: number;

  extraMinute?: number;

  team: "home" | "away";

  type: TimelineEventType;

  title: string;

  description?: string;

  player?: TimelinePlayer;

  relatedPlayer?: TimelinePlayer;

  important?: boolean;
}