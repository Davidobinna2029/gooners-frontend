import type { FootballEvent } from "@/src/lib/football/types";

export interface BallProgression {
  home: number;
  away: number;
}

export function calculateBallProgression(
  events: FootballEvent[],
  homeTeamId: number,
  awayTeamId: number
): BallProgression {

  let home = 0;
  let away = 0;

  for (const event of events) {

    if (
      event.type !== "pass" &&
      event.type !== "successful_pass" &&
      event.type !== "key_pass"
    ) {
      continue;
    }

    if (
      event.x == null ||
      event.endX == null ||
      !event.successful
    ) {
      continue;
    }

    const progression =
      event.endX - event.x;

    if (progression < 8) {
      continue;
    }

    if (event.teamId === homeTeamId) {

      home += progression;

    } else if (
      event.teamId === awayTeamId
    ) {

      away += progression;

    }

  }

  return {

    home: Math.round(home),

    away: Math.round(away),

  };

}