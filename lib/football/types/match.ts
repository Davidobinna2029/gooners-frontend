// lib/football/types/match.ts

import type { Competition } from "./competition";
import type { Team } from "./team";

export type MatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "LIVE"
  | "IN_PLAY"
  | "PAUSED"
  | "HALF_TIME"
  | "EXTRA_TIME"
  | "PENALTY_SHOOTOUT"
  | "FINISHED"
  | "POSTPONED"
  | "SUSPENDED"
  | "CANCELLED";

export interface Score {
  home: number;
  away: number;
}

export interface Match {
  id: number;

  status: MatchStatus;

  kickoff: string;

  venue?: string;

  competition: Competition;

  homeTeam: Team;

  awayTeam: Team;

  score: Score;

  /**
   * Current elapsed minute for live matches.
   */
  minute?: number;
}