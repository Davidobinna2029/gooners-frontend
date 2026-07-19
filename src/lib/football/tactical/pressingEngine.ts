// src/lib/football/tactical/pressingEngine.ts

import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface PressingIntensityData {

  home: number;

  away: number;

  homeActions: number;

  awayActions: number;

}


export function calculatePressingIntensity(
  events: FootballEvent[],
  homeTeamId: number,
  awayTeamId: number
): PressingIntensityData {


  let homePressActions = 0;

  let awayPressActions = 0;


  for (const event of events) {


    const isPressingAction =
      event.type === "tackle" ||
      event.type === "interception" ||
      event.type === "recovery" ||
      event.type === "duel_won";


    if (!isPressingAction) {

      continue;

    }


    if (event.teamId === homeTeamId) {

      homePressActions++;

    }


    if (event.teamId === awayTeamId) {

      awayPressActions++;

    }

  }


  const homeIntensity =
    Math.min(
      100,
      homePressActions * 5
    );


  const awayIntensity =
    Math.min(
      100,
      awayPressActions * 5
    );


  return {

    home: homeIntensity,

    away: awayIntensity,

    homeActions: homePressActions,

    awayActions: awayPressActions,

  };

}