// lib/football/data/normalizeMatch.ts

import type {
  MatchData,
  NormalizedMatch,
  NormalizedTeam,
  NormalizedScore,
} from "./types";

/* ==========================================================
   RAW TYPES (Football-Data.org)
========================================================== */

export interface FootballDataMatchResponse {
  match: {
    id: number;
    status: string;
    utcDate: string;
    venue?: string;
    stage?: string;

    competition: {
      id: number;
      name: string;
      code: string;
    };

    homeTeam: {
      id: number;
      name: string;
      shortName?: string;
      tla?: string;
      crest?: string;
    };

    awayTeam: {
      id: number;
      name: string;
      shortName?: string;
      tla?: string;
      crest?: string;
    };

    score: {
      fullTime: {
        home: number | null;
        away: number | null;
      };

      halfTime: {
        home: number | null;
        away: number | null;
      };
    };
  };
}

/* ==========================================================
   TEAM
========================================================== */

function normalizeTeam(
  team: FootballDataMatchResponse["match"]["homeTeam"]
): NormalizedTeam {
  return {
    id: team.id,
    name: team.name,
    shortName: team.shortName,
    tla: team.tla,
    crest: team.crest,
  };
}

/* ==========================================================
   SCORE
========================================================== */

function normalizeScore(
  score: FootballDataMatchResponse["match"]["score"]
): NormalizedScore {
  return {
    home: score.fullTime.home ?? 0,
    away: score.fullTime.away ?? 0,
    halftimeHome: score.halfTime.home ?? undefined,
    halftimeAway: score.halfTime.away ?? undefined,
  };
}

/* ==========================================================
   MATCH
========================================================== */

export function normalizeMatch(
  raw: FootballDataMatchResponse
): MatchData {
  const match: NormalizedMatch = {
    id: raw.match.id,
    status: raw.match.status,
    utcDate: raw.match.utcDate,
    venue: raw.match.venue,
    stage: raw.match.stage,

    competition: {
      id: raw.match.competition.id,
      name: raw.match.competition.name,
      code: raw.match.competition.code,
    },

    homeTeam: normalizeTeam(raw.match.homeTeam),
    awayTeam: normalizeTeam(raw.match.awayTeam),

    score: normalizeScore(raw.match.score),
  };

  return {
    match,
    events: [],
    homeLineup: undefined,
    awayLineup: undefined,
    raw,
  };
}