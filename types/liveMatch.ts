import { Match } from "@/types/match";

export interface LiveScore {
  home: number;
  away: number;
}

export interface LiveMatchState extends Match {
  status: "upcoming" | "live" | "finished";

  score?: LiveScore;

  minute?: number;

  events?: MatchEvent[];
}

export interface MatchEvent {
  type: "goal" | "card" | "substitution" | "kickoff" | "fulltime";
  team?: "home" | "away";
  player?: string;
  minute: number;
  text: string;
}