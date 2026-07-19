import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface ExpectedThreat {

  home: number;

  away: number;

}

export function calculateExpectedThreat(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): ExpectedThreat {

  let home = 0;

  let away = 0;

  for (const event of events) {

    if (!event.teamId) continue;

    let value = 0;

    switch (event.type) {

      case "key_pass":

        value = 0.08;

        break;

      case "cross":

        value = 0.06;

        break;

      case "assist":

        value = 0.18;

        break;

      case "shot":

        value = 0.12;

        break;

      case "shot_on_target":

        value = 0.18;

        break;

      case "goal":

      case "penalty_goal":

        value = 0.35;

        break;

      default:

        value = 0;

    }

    if (event.teamId === homeTeamId) {

      home += value;

    }

    if (event.teamId === awayTeamId) {

      away += value;

    }

  }

  return {

    home: Number(home.toFixed(2)),

    away: Number(away.toFixed(2)),

  };

}