// lib/football/providers/apiFootball/mapper.ts

import type { Match } from "../../types/match";

export function mapApiFootballMatch(
  fixture: any
): Match {
  return {
    id: fixture.fixture.id,

    status: mapStatus(
      fixture.fixture.status.short
    ),

    kickoff: fixture.fixture.date,

    venue:
      fixture.fixture.venue?.name,

    competition: {
      id: fixture.league.id,
      name: fixture.league.name,
      emblem: fixture.league.logo,
    },

    homeTeam: {
      id: fixture.teams.home.id,
      name: fixture.teams.home.name,
      crest: fixture.teams.home.logo,
    },

    awayTeam: {
      id: fixture.teams.away.id,
      name: fixture.teams.away.name,
      crest: fixture.teams.away.logo,
    },

    score: {
      home:
        fixture.goals.home ?? 0,

      away:
        fixture.goals.away ?? 0,
    },
  };
}

function mapStatus(
  status: string
): Match["status"] {
  switch (status) {
    case "NS":
      return "SCHEDULED";

    case "TBD":
      return "TIMED";

    case "1H":
    case "2H":
      return "LIVE";

    case "HT":
      return "HALF_TIME";

    case "ET":
      return "EXTRA_TIME";

    case "P":
      return "PENALTY_SHOOTOUT";

    case "FT":
      return "FINISHED";

    case "PST":
      return "POSTPONED";

    case "SUSP":
      return "SUSPENDED";

    case "CANC":
      return "CANCELLED";

    default:
      return "SCHEDULED";
  }
}