// lib/football/providers/apiFootball/advanced/headToHeadMapper.ts

import type {
  HeadToHeadMatch,
} from "../../../advancedProvider";

export function mapApiFootballHeadToHead(
  response: any[]
): HeadToHeadMatch[] {
  return response.map((fixture) => ({
    id:
      fixture.fixture.id,

    date:
      fixture.fixture.date,

    competition:
      fixture.league.name,

    homeTeam:
      fixture.teams.home.name,

    awayTeam:
      fixture.teams.away.name,

    homeScore:
      fixture.goals.home ?? 0,

    awayScore:
      fixture.goals.away ?? 0,

    winner:
      fixture.teams.home.winner === true
        ? "HOME"
        : fixture.teams.away.winner === true
        ? "AWAY"
        : "DRAW",
  }));
}