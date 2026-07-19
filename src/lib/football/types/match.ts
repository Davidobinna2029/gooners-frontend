import type { FootballCompetition } from "./competition";
import type { FootballEvent } from "./event";
import type { FootballLineup } from "./lineup";
import type { TeamStatistic } from "./statistics";
import type { FootballTeam } from "./team";
import type { FootballVenue } from "./venue";
import type { ID, ISODateString } from "./common";

export type MatchStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "finished"
  | "postponed"
  | "cancelled";

export interface FootballMatch {
  id: ID;

  kickoff: ISODateString;

  elapsedSeconds?: number;

  status: MatchStatus;

  homeTeam: FootballTeam;

  awayTeam: FootballTeam;

  homeScore: number;

  awayScore: number;

  venue?: FootballVenue;

  competition?: FootballCompetition;

  events?: FootballEvent[];

  statistics?: TeamStatistic[];

  lineups?: FootballLineup[];
}