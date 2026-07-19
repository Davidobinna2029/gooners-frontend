// src/lib/football/analytics/territoryEngine.ts

import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface TerritoryControl {

  home: number;

  away: number;

}

const EVENT_WEIGHTS: Record<string, number> = {

  goal: 12,

  penalty_goal: 12,

  penalty_miss: 10,

  shot: 8,

  corner: 6,

  var: 3,

  foul: 2,

};

export function calculateTerritory(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): TerritoryControl {

  let homeScore = 0;

  let awayScore = 0;

  for (const event of events) {

    if (!event.teamId) {

      continue;

    }

    const weight =
      EVENT_WEIGHTS[event.type] ?? 0;

    if (weight === 0) {

      continue;

    }

    if (event.teamId === homeTeamId) {

      homeScore += weight;

    }

    else if (
      event.teamId === awayTeamId
    ) {

      awayScore += weight;

    }

  }

  const total =
    homeScore + awayScore;

  if (total === 0) {

    return {

      home: 50,

      away: 50,

    };

  }

  return {

    home: Math.round(
      (homeScore / total) * 100
    ),

    away: Math.round(
      (awayScore / total) * 100
    ),

  };

}