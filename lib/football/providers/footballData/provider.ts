// lib/football/providers/footballData/provider.ts

import type { FootballProvider } from "../../provider";

import type { Match } from "../../types/match";
import type { Fixture } from "../../types/fixture";
import type { Standing } from "../../types/standings";
import type { Team } from "../../types/team";

import { footballDataFetch } from "./client";
import { mapFootballDataMatch } from "./mapper";

import type {
  FootballDataMatchResponse,
  FootballDataStandingsResponse,
} from "./types";

const ARSENAL_TEAM_ID = 57;

class FootballDataProvider
  implements FootballProvider
{
  async getNextMatch(): Promise<Match | null> {
    const data =
      await footballDataFetch<FootballDataMatchResponse>(
        `/teams/${ARSENAL_TEAM_ID}/matches?limit=20`
      );

    const matches = data.matches ?? [];

    const live = matches.find((match) =>
      ["LIVE", "IN_PLAY", "PAUSED"].includes(
        match.status
      )
    );

    const scheduled = matches.find(
      (match) =>
        match.status === "SCHEDULED"
    );

    const finished = [...matches]
      .reverse()
      .find(
        (match) =>
          match.status === "FINISHED"
      );

    const selected =
      live ??
      scheduled ??
      finished;

    if (!selected) {
      return null;
    }

    return mapFootballDataMatch(
      selected
    );
  }


  async getFixtures(): Promise<Fixture[]> {
    const data =
      await footballDataFetch<FootballDataMatchResponse>(
        `/teams/${ARSENAL_TEAM_ID}/matches?status=SCHEDULED`
      );

    return (data.matches ?? []).map(
      mapFootballDataMatch
    );
  }


  async getResults(): Promise<Fixture[]> {
    const data =
      await footballDataFetch<FootballDataMatchResponse>(
        `/teams/${ARSENAL_TEAM_ID}/matches?status=FINISHED`
      );

    return (data.matches ?? []).map(
      mapFootballDataMatch
    );
  }


  async getStandings(): Promise<
    Standing[]
  > {
    const data =
      await footballDataFetch<FootballDataStandingsResponse>(
        `/competitions/PL/standings`
      );

    const table =
      data.standings?.[0]?.table ?? [];

    return table.map((item) => ({
      position:
        item.position,

      team: {
        id:
          item.team.id,

        name:
          item.team.name,

        shortName:
          item.team.shortName,

        tla:
          item.team.tla,

        crest:
          item.team.crest,
      },

      played:
        item.playedGames,

      won:
        item.won,

      draw:
        item.draw,

      lost:
        item.lost,

      goalsFor:
        item.goalsFor,

      goalsAgainst:
        item.goalsAgainst,

      goalDifference:
        item.goalDifference,

      points:
        item.points,

      form:
        item.form,
    }));
  }


  async getMatch(
    id: number
  ): Promise<Match | null> {
    const data =
      await footballDataFetch<any>(
        `/matches/${id}`
      );

    return mapFootballDataMatch(
      data
    );
  }


  async getTeam(
    id: number
  ): Promise<Team | null> {
    const data =
      await footballDataFetch<any>(
        `/teams/${id}`
      );

    return {
      id: data.id,
      name: data.name,
      shortName: data.shortName,
      tla: data.tla,
      crest: data.crest,
    };
  }
}


export const footballDataProvider =
  new FootballDataProvider();