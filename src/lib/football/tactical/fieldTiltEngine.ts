import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface FieldTilt {

  home: number;

  away: number;

}

const EVENT_WEIGHTS: Record<string, number> = {

  goal: 14,

  penalty_goal: 14,

  penalty_miss: 10,

  shot: 8,

  shot_on_target: 10,

  shot_off_target: 7,

  blocked_shot: 7,

  key_pass: 7,

  cross: 5,

  corner: 5,

};

export function calculateFieldTilt(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number,

): FieldTilt {

  let home = 0;

  let away = 0;

  for (const event of events) {

    if (!event.teamId) continue;

    const weight =
      EVENT_WEIGHTS[event.type] ?? 0;

    if (weight === 0) continue;

    if (event.teamId === homeTeamId) {

      home += weight;

    } else if (

      event.teamId === awayTeamId

    ) {

      away += weight;

    }

  }

  const total = home + away;

  if (total === 0) {

    return {

      home: 50,

      away: 50,

    };

  }

  return {

    home: Math.round(

      (home / total) * 100

    ),

    away: Math.round(

      (away / total) * 100

    ),

  };

}