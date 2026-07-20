import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface FinalThirdEntriesResult {

  home: number;

  away: number;

}

function isEntry(
  event: FootballEvent
): boolean {

  const allowed = [
    "pass",
    "successful_pass",
    "key_pass",
    "cross",
    "carry",
    "dribble",
    "take_on",
  ];

  if (!allowed.includes(event.type)) {

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

  /**
   * Entry into attacking third.
   *
   * Pitch:
   * 0 ---------------- 100
   *
   * Final third begins around 67.
   */

  return (

    event.x < 67 &&
    event.endX >= 67

  );

}

export function calculateFinalThirdEntries(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): FinalThirdEntriesResult {

  let home = 0;

  let away = 0;

  for (const event of events) {

    if (!event.teamId) {

      continue;

    }

    if (!isEntry(event)) {

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