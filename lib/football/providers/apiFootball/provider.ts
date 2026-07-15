// lib/football/providers/apiFootball/provider.ts

import type { FootballProvider } from "../../provider";

import type { Match } from "../../types/match";
import type { Fixture } from "../../types/fixture";
import type { Standing } from "../../types/standings";
import type { Team } from "../../types/team";

import { apiFootballFetch } from "./client";
import { mapApiFootballMatch } from "./mapper";

const ARSENAL_TEAM_ID = 42;

// Premier League
const PREMIER_LEAGUE_ID = 39;

// Update this each season
const CURRENT_SEASON = 2026;

class ApiFootballProvider
  implements FootballProvider
{
  async getNextMatch(): Promise<Match | null> {
    const data =
      await apiFootballFetch<any>(
        `/fixtures?team=${ARSENAL_TEAM_ID}&next=1`
      );

    const fixture =
      data.response?.[0];

    if (!fixture) {
      return null;
    }

    return mapApiFootballMatch(
      fixture
    );
  }

  async getFixtures(): Promise<
    Fixture[]
  > {
    const data =
      await apiFootballFetch<any>(
        `/fixtures?team=${ARSENAL_TEAM_ID}&next=20`
      );

    return (
      data.response ?? []
    ).map(mapApiFootballMatch);
  }

  async getResults(): Promise<
    Fixture[]
  > {
    const data =
      await apiFootballFetch<any>(
        `/fixtures?team=${ARSENAL_TEAM_ID}&last=20`
      );

    return (
      data.response ?? []
    ).map(mapApiFootballMatch);
  }

  async getStandings(): Promise<
    Standing[]
  > {
    const data =
      await apiFootballFetch<any>(
        `/standings?league=${PREMIER_LEAGUE_ID}&season=${CURRENT_SEASON}`
      );

    const table =
      data.response?.[0]?.league
        ?.standings?.[0] ?? [];

    return table.map(
      (row: any): Standing => ({
        position: row.rank,

        team: {
          id: row.team.id,
          name: row.team.name,
          crest: row.team.logo,
        },

        played: row.all.played,

        won: row.all.win,

        draw: row.all.draw,

        lost: row.all.lose,

        goalsFor:
          row.all.goals.for,

        goalsAgainst:
          row.all.goals.against,

        goalDifference:
          row.goalsDiff,

        points: row.points,

        form: row.form,
      })
    );
  }

  async getMatch(
    id: number
  ): Promise<Match | null> {
    const data =
      await apiFootballFetch<any>(
        `/fixtures?id=${id}`
      );

    const fixture =
      data.response?.[0];

    if (!fixture) {
      return null;
    }

    return mapApiFootballMatch(
      fixture
    );
  }

  async getTeam(
    id: number
  ): Promise<Team | null> {
    const data =
      await apiFootballFetch<any>(
        `/teams?id=${id}`
      );

    const team =
      data.response?.[0]?.team;

    if (!team) {
      return null;
    }

    return {
      id: team.id,
      name: team.name,
      shortName: team.name,
      tla: undefined,
      crest: team.logo,
    };
  }
}

export const apiFootballProvider =
  new ApiFootballProvider();