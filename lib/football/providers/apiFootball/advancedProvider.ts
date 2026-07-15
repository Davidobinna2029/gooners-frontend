// lib/football/providers/apiFootball/advancedProvider.ts

import type {
  AdvancedFootballProvider,
  MatchEvent,
  MatchStatistic,
  TeamLineup,
  HeadToHeadMatch,
  Injury,
  PlayerProfile,
} from "../../advancedProvider";

import { apiFootballFetch } from "./client";

import { mapApiFootballEvents } from "./advanced/eventMapper";
import { mapApiFootballStatistics } from "./advanced/statisticsMapper";
import { mapApiFootballLineups } from "./advanced/lineupMapper";
import { mapApiFootballHeadToHead } from "./advanced/headToHeadMapper";
import { mapApiFootballInjuries } from "./advanced/injuryMapper";
import { mapApiFootballPlayers } from "./advanced/playerMapper";

export class ApiFootballAdvancedProvider
  implements AdvancedFootballProvider
{
  async getEvents(
    matchId: number
  ): Promise<MatchEvent[]> {
    const data =
      await apiFootballFetch<any>(
        `/fixtures/events?fixture=${matchId}`
      );

    return mapApiFootballEvents(
      data.response ?? []
    );
  }

  async getStatistics(
    matchId: number
  ): Promise<MatchStatistic[]> {
    const data =
      await apiFootballFetch<any>(
        `/fixtures/statistics?fixture=${matchId}`
      );

    return mapApiFootballStatistics(
      data.response ?? []
    );
  }

  async getLineups(
    matchId: number
  ): Promise<TeamLineup[]> {
    const data =
      await apiFootballFetch<any>(
        `/fixtures/lineups?fixture=${matchId}`
      );

    return mapApiFootballLineups(
      data.response ?? []
    );
  }

  async getHeadToHead(
    homeTeamId: number,
    awayTeamId: number
  ): Promise<HeadToHeadMatch[]> {
    const data =
      await apiFootballFetch<any>(
        `/fixtures/headtohead?h2h=${homeTeamId}-${awayTeamId}`
      );

    return mapApiFootballHeadToHead(
      data.response ?? []
    );
  }

  async getInjuries(
    teamId: number
  ): Promise<Injury[]> {
    const season =
      Number(
        process.env.FOOTBALL_SEASON
      );

    const league =
      Number(
        process.env.API_FOOTBALL_LEAGUE_ID
      );

    const data =
      await apiFootballFetch<any>(
        `/injuries?team=${teamId}&league=${league}&season=${season}`
      );

    return mapApiFootballInjuries(
      data.response ?? []
    );
  }

  async getPlayers(
    teamId: number
  ): Promise<PlayerProfile[]> {
    const season =
      Number(
        process.env.FOOTBALL_SEASON
      );

    const league =
      Number(
        process.env.API_FOOTBALL_LEAGUE_ID
      );

    const data =
      await apiFootballFetch<any>(
        `/players?team=${teamId}&league=${league}&season=${season}`
      );

    return mapApiFootballPlayers(
      data.response ?? []
    );
  }
}

export const apiFootballAdvancedProvider =
  new ApiFootballAdvancedProvider();