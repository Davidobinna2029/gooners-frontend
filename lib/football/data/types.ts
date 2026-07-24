// lib/football/data/types.ts

/* ==========================================================
   NORMALIZED MATCH
========================================================== */

export interface NormalizedMatch {

  id: number;

  status: string;

  utcDate: string;

  minute?: number;

  stage?: string;

  competition: {
    id: number;
    name: string;
    code: string;
  };

  venue?: string;

  homeTeam: NormalizedTeam;

  awayTeam: NormalizedTeam;

  score: NormalizedScore;

}

/* ==========================================================
   TEAM
========================================================== */

export interface NormalizedTeam {

  id: number;

  name: string;

  shortName?: string;

  tla?: string;

  crest?: string;

}

/* ==========================================================
   SCORE
========================================================== */

export interface NormalizedScore {

  home: number;

  away: number;

  halftimeHome?: number;

  halftimeAway?: number;

}

/* ==========================================================
   EVENTS
========================================================== */

export interface NormalizedEvent {

  minute: number;

  type: string;

  team: "home" | "away";

  player?: string;

  assist?: string;

  detail?: string;

}

/* ==========================================================
   LINEUP
========================================================== */

export interface NormalizedLineup {

  formation?: string;

  startingXI: string[];

  substitutes: string[];

}

/* ==========================================================
   MATCH DATA
========================================================== */

export interface MatchData {

  match: NormalizedMatch;

  events: NormalizedEvent[];

  homeLineup?: NormalizedLineup;

  awayLineup?: NormalizedLineup;

  raw: unknown;

}