// src/lib/football/xg/xgEngine.ts

import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface ExpectedGoals {

  home: number;

  away: number;

}

const WEIGHTS = {

  shot: 0.08,

  penalty_goal: 0.79,

  penalty_miss: 0.79,

  goal: 0.30,

  own_goal: 0,

};

export function calculateExpectedGoals(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): ExpectedGoals {

  let home = 0;

  let away = 0;

  for (const event of events) {

    let value = 0;

    switch (event.type) {

      case "shot":

        value = WEIGHTS.shot;

        break;

      case "goal":

        value = WEIGHTS.goal;

        break;

      case "penalty_goal":

      case "penalty_miss":

        value = WEIGHTS.penalty_goal;

        break;

      case "own_goal":

        value = WEIGHTS.own_goal;

        break;

      default:

        value = 0;

    }

    if (!event.teamId) continue;

    if (event.teamId === homeTeamId) {

      home += value;

    }

    else if (

      event.teamId === awayTeamId

    ) {

      away += value;

    }

  }

  return {

    home: Number(home.toFixed(2)),

    away: Number(away.toFixed(2)),

  };

}