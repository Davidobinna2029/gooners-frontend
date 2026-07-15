// lib/match/types.ts

export type MatchStatus =
  | "NS"        // Not Started
  | "LIVE"
  | "HT"
  | "FT"
  | "AET"
  | "PEN"
  | "POSTPONED"
  | "CANCELLED";

export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo: string;
}

export interface Competition {
  id: number;
  name: string;
  logo: string;
  round: string;
}

export interface Venue {
  id: number;
  name: string;
  city: string;
}

export interface Score {
  home: number;
  away: number;
}

export interface MatchEvent {
  id: number;
  minute: number;
  type:
    | "Goal"
    | "Own Goal"
    | "Penalty"
    | "Yellow Card"
    | "Red Card"
    | "Substitution"
    | "VAR";

  player: string;
  teamId: number;
  detail?: string;
}

export interface TeamStatistic {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
}

export interface MatchStatistics {
  home: TeamStatistic;
  away: TeamStatistic;
}

export interface Match {
  id: number;

  kickoff: string;

  minute?: number;

  status: MatchStatus;

  competition: Competition;

  venue: Venue;

  home: Team;

  away: Team;

  score: Score;

  events: MatchEvent[];

  statistics?: MatchStatistics;
}