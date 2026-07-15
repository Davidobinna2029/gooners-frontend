// lib/football/providers/footballData/types.ts

export interface FootballDataMatchResponse {
  matches: FootballDataMatch[];
}


export interface FootballDataMatch {
  id: number;

  status: string;

  utcDate: string;

  venue?: string;

  competition: {
    id: number;
    name: string;
    code?: string;
    emblem?: string;
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
  };
}


// ===============================
// STANDINGS
// ===============================

export interface FootballDataStandingsResponse {
  standings: FootballDataStandingTable[];
}


export interface FootballDataStandingTable {
  table: FootballDataStanding[];
}


export interface FootballDataStanding {
  position: number;

  team: {
    id: number;
    name: string;
    shortName?: string;
    tla?: string;
    crest?: string;
  };

  playedGames: number;

  won: number;

  draw: number;

  lost: number;

  goalsFor: number;

  goalsAgainst: number;

  goalDifference: number;

  points: number;

  form?: string;
}