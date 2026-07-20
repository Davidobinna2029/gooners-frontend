import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface CarryDistanceResult {
  home: number;
  away: number;
}

function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  return Math.sqrt(
    Math.pow(x2 - x1, 2) +
      Math.pow(y2 - y1, 2)
  );
}

export function calculateCarryDistance(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): CarryDistanceResult {

  let home = 0;

  let away = 0;

  for (const event of events) {

    if (
      event.type !== "carry" &&
      event.type !== "dribble" &&
      event.type !== "take_on"
    ) {
      continue;
    }

    if (!event.successful) {
      continue;
    }

    if (
      event.teamId === undefined ||
      event.x === undefined ||
      event.y === undefined ||
      event.endX === undefined ||
      event.endY === undefined
    ) {
      continue;
    }

    const metres = distance(
      event.x,
      event.y,
      event.endX,
      event.endY
    );

    if (event.teamId === homeTeamId) {

      home += metres;

    } else if (
      event.teamId === awayTeamId
    ) {

      away += metres;

    }

  }

  return {

    home: Number(home.toFixed(1)),

    away: Number(away.toFixed(1)),

  };

}