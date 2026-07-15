// lib/football/providers/footballData/mapper.ts

import type { Match } from "../../types/match";

import type {
  FootballDataMatch,
} from "./types";

export function mapFootballDataMatch(
  match: FootballDataMatch
): Match {
  return {
    id: match.id,

    status: match.status as Match["status"],

    kickoff: match.utcDate,

    venue: match.venue,

    competition: {
      id: match.competition.id,
      name: match.competition.name,
      code: match.competition.code,
      emblem: match.competition.emblem,
    },

    homeTeam: {
      id: match.homeTeam.id,
      name: match.homeTeam.name,
      shortName:
        match.homeTeam.shortName,
      tla: match.homeTeam.tla,
      crest: match.homeTeam.crest,
    },

    awayTeam: {
      id: match.awayTeam.id,
      name: match.awayTeam.name,
      shortName:
        match.awayTeam.shortName,
      tla: match.awayTeam.tla,
      crest: match.awayTeam.crest,
    },

    score: {
      home:
        match.score.fullTime.home ??
        0,

      away:
        match.score.fullTime.away ??
        0,
    },
  };
}