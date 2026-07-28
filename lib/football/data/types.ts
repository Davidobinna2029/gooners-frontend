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
   PLAYER STATS

   Provider-agnostic per-player match stats — same normalization
   principle as NormalizedEvent/NormalizedTeam above. Raw
   provider parsing (e.g. API-Football's rating/accuracy strings)
   happens in that provider's mapper (see
   lib/football/data/apiFootball/mapPlayersToNormalized.ts), not
   here. Only fields verified to exist across providers you
   actually use belong on this type — see the capability-flags
   discussion in lib/football/intelligence/player/types.ts for
   what's deliberately NOT here (xG, xA, progression, pressing).
========================================================== */
export interface NormalizedPlayerStats {
  playerId: number;
  playerName: string;
  team: "home" | "away";

  shirtNumber?: number;
  position?: string;

  minutesPlayed: number;

  /** 0-10. Undefined when the provider has no rating (e.g. unused substitute) — not the same as a real 0. */
  rating?: number;

  goals: number;
  assists: number;

  shots: number;
  shotsOnTarget: number;

  keyPasses: number;
  passesAttempted: number;
  /** 0-100 */
  passAccuracy: number;

  tackles: number;
  interceptions: number;
  duelsWon: number;
  duelsTotal: number;
  dribblesSuccessful: number;

  foulsCommitted: number;
  foulsDrawn: number;

  yellowCards: number;
  redCards: number;
}
/* ==========================================================
   MATCH DATA
========================================================== */
export interface MatchData {
  match: NormalizedMatch;
  events: NormalizedEvent[];
  /**
   * Optional because not every provider/tier has per-player stats
   * (e.g. football-data.org's free tier likely doesn't) — treat
   * as an empty array, not a missing/broken response, when absent.
   */
  players?: NormalizedPlayerStats[];
  homeLineup?: NormalizedLineup;
  awayLineup?: NormalizedLineup;
  raw: unknown;
}