// src/lib/football/analytics/bigChancesEngine.ts

import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface BigChances {

  home: number;

  away: number;

}

export function calculateBigChances(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): BigChances {

  let home = 0;

  let away = 0;

  for (const event of events) {

    /**
     * For now we approximate:
     *
     * - Goals
     * - Penalties
     * - Penalty misses
     *
     * Later we'll replace this with
     * provider supplied xG chance quality.
     */

    const bigChance =

      event.type === "goal" ||

      event.type === "penalty_goal" ||

      event.type === "penalty_miss";

    if (!bigChance) {

      continue;

    }

    if (event.teamId === homeTeamId) {

      home++;

    }

    else if (

      event.teamId === awayTeamId

    ) {

      away++;

    }

  }

  return {

    home,

    away,

  };

}