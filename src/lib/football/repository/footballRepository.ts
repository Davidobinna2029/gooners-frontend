import type {
  FootballEvent,
  FootballLineup,
  FootballPlayer,
  TeamStatistic,
} from "@/src/lib/football/types";

import type {
  HeadToHeadMatch,
  Injury,
} from "@/lib/football/advancedProvider";

export interface FootballRepository {
  getEvents(
    matchId: number
  ): Promise<FootballEvent[]>;

  getStatistics(
    matchId: number
  ): Promise<TeamStatistic[]>;

  getLineups(
    matchId: number
  ): Promise<FootballLineup[]>;

  getHeadToHead(
    homeTeamId: number,
    awayTeamId: number
  ): Promise<HeadToHeadMatch[]>;

  getInjuries(
    teamId: number
  ): Promise<Injury[]>;

  getPlayers(
    teamId: number
  ): Promise<FootballPlayer[]>;
}