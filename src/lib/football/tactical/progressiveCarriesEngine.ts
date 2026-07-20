import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface ProgressiveCarriesResult {

  home: number;

  away: number;

}

function isProgressiveCarry(
  event: FootballEvent
): boolean {

  if (
    event.type !== "carry" &&
    event.type !== "dribble" &&
    event.type !== "take_on"
  ) {
    return false;
  }

  if (!event.successful) {
    return false;
  }

  if (
    event.x === undefined ||
    event.endX === undefined
  ) {
    return false;
  }

  const progress =
    event.endX - event.x;

  /**
   * Similar progression thresholds
   * used for progressive passes.
   */

  if (event.x < 35) {

    return progress >= 30;

  }

  if (event.x < 70) {

    return progress >= 20;

  }

  return progress >= 10;

}

export function calculateProgressiveCarries(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): ProgressiveCarriesResult {

  let home = 0;

  let away = 0;

  for (const event of events) {

    if (!event.teamId) {
      continue;
    }

    if (!isProgressiveCarry(event)) {
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