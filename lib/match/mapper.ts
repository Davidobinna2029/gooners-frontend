// lib/match/mapper.ts

import type { Match } from "./types";

/**
 * Maps a football API response into our internal Match model.
 *
 * Replace the `any` type with your football API response type
 * once your API client is connected.
 */
export function mapMatch(apiMatch: any): Match {
  return {
    id: apiMatch.id,

    kickoff: apiMatch.kickoff,

    minute: apiMatch.minute,

    status: apiMatch.status,

    competition: {
      id: apiMatch.competition.id,
      name: apiMatch.competition.name,
      logo: apiMatch.competition.logo,
      round: apiMatch.competition.round,
    },

    venue: {
      id: apiMatch.venue.id,
      name: apiMatch.venue.name,
      city: apiMatch.venue.city,
    },

    home: {
      id: apiMatch.home.id,
      name: apiMatch.home.name,
      shortName: apiMatch.home.shortName,
      logo: apiMatch.home.logo,
    },

    away: {
      id: apiMatch.away.id,
      name: apiMatch.away.name,
      shortName: apiMatch.away.shortName,
      logo: apiMatch.away.logo,
    },

    score: {
      home: apiMatch.score.home,
      away: apiMatch.score.away,
    },

    events: apiMatch.events ?? [],

    statistics: apiMatch.statistics,
  };
}