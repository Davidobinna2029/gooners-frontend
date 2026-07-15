// lib/football/advancedProvider.ts

/**
 * Advanced provider capabilities.
 *
 * Football-Data.org implements only a subset of these.
 *
 * API-Football implements nearly all of them.
 *
 * Components should check whether the active provider
 * supports these methods before using them.
 */

export interface MatchEvent {
  id: number;

  minute: number;

  extraMinute?: number;

  teamId: number;

  player?: string;

  assist?: string;

  type:
    | "Goal"
    | "Own Goal"
    | "Penalty"
    | "Missed Penalty"
    | "Yellow Card"
    | "Red Card"
    | "Substitution"
    | "VAR"
    | "Injury"
    | "Other";

  detail?: string;
}

export interface MatchStatistic {
  type: string;

  home: number | string | null;

  away: number | string | null;
}

export interface LineupPlayer {
  id: number;

  name: string;

  number?: number;

  position?: string;

  grid?: string;

  captain?: boolean;
}

export interface TeamLineup {
  teamId: number;

  teamName: string;

  formation: string;

  coach: string;

  startingXI: LineupPlayer[];

  substitutes: LineupPlayer[];
}

export interface HeadToHeadMatch {
  id: number;

  date: string;

  competition: string;

  homeTeam: string;

  awayTeam: string;

  homeScore: number;

  awayScore: number;
}

export interface Injury {
  playerId: number;

  player: string;

  teamId: number;

  injury: string;

  reason?: string;

  expectedReturn?: string;
}

export interface PlayerProfile {
  id: number;

  name: string;

  age?: number;

  nationality?: string;

  photo?: string;

  position?: string;

  number?: number;

  appearances?: number;

  goals?: number;

  assists?: number;
}

export interface AdvancedFootballProvider {
  /**
   * Match timeline
   *
   * Goals
   * Cards
   * VAR
   * Substitutions
   */

  getEvents(
    matchId: number
  ): Promise<MatchEvent[]>;

  /**
   * Match statistics
   */

  getStatistics(
    matchId: number
  ): Promise<MatchStatistic[]>;

  /**
   * Starting XI
   * Bench
   * Coach
   */

  getLineups(
    matchId: number
  ): Promise<TeamLineup[]>;

  /**
   * Previous meetings
   */

  getHeadToHead(
    homeTeamId: number,
    awayTeamId: number
  ): Promise<HeadToHeadMatch[]>;

  /**
   * Squad injuries
   */

  getInjuries(
    teamId: number
  ): Promise<Injury[]>;

  /**
   * Team players
   */

  getPlayers(
    teamId: number
  ): Promise<PlayerProfile[]>;
}