// lib/football/data/apiFootball/mapMatchToNormalized.ts

import type { NormalizedMatch } from "@/lib/football/data/types";

/* ==========================================================
   RAW PROVIDER SHAPE (API-FOOTBALL)

   Matches GET /fixtures?id={id}'s documented response.
   Built from documentation, not a captured live payload —
   verify against a real response before trusting field names
   exactly.
========================================================== */

export interface ApiFootballFixture {
  fixture: {
    id: number;
    referee: string | null;
    date: string;
    timestamp: number;
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    season: number;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
  };
}

/* ==========================================================
   PUBLIC API
========================================================== */

/**
 * Maps a raw API-Football fixture into NormalizedMatch.
 *
 * CAVEAT — competition.code: API-Football's league object has no
 * short-code field equivalent to football-data.org's "PL"/"CL"
 * style codes. Left as an empty string rather than inventing one —
 * don't rely on NormalizedMatch.competition.code being populated
 * for this provider.
 */
export function mapApiFootballFixtureToNormalized(
  fixture: ApiFootballFixture
): NormalizedMatch {

  return {
    id: fixture.fixture.id,
    status: fixture.fixture.status.short,
    utcDate: fixture.fixture.date,
    minute: fixture.fixture.status.elapsed ?? undefined,
    stage: fixture.league.round,

    competition: {
      id: fixture.league.id,
      name: fixture.league.name,
      code: "",
    },

    venue: fixture.fixture.venue.name ?? undefined,

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
      home: fixture.goals.home ?? 0,
      away: fixture.goals.away ?? 0,
      halftimeHome: fixture.score.halftime.home ?? undefined,
      halftimeAway: fixture.score.halftime.away ?? undefined,
    },
  };

}