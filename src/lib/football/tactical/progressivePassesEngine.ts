import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface ProgressivePassesResult {
  home: number;
  away: number;
}

function isProgressivePass(event: FootballEvent): boolean {

  if (
    event.type !== "pass" &&
    event.type !== "successful_pass" &&
    event.type !== "key_pass" &&
    event.type !== "cross"
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

  const progress = event.endX - event.x;

  /**
   * Similar to Wyscout:
   *
   * Defensive third:
   * must advance at least 30%
   *
   * Middle third:
   * advance at least 20%
   *
   * Final third:
   * advance at least 10%
   */

  if (event.x < 35) {

    return progress >= 30;

  }

  if (event.x < 70) {

    return progress >= 20;

  }

  return progress >= 10;

}

export function calculateProgressivePasses(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): ProgressivePassesResult {

  let home = 0;

  let away = 0;

  for (const event of events) {

    if (!event.teamId) {
      continue;
    }

    if (!isProgressivePass(event)) {
      continue;
    }

    if (event.teamId === homeTeamId) {

      home++;

    }

    else if (event.teamId === awayTeamId) {

      away++;

    }

  }

  return {

    home,

    away,

  };

}