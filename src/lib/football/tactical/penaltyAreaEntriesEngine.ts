import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface PenaltyAreaEntriesResult {

  home: number;

  away: number;

}


function isPenaltyAreaEntry(
  event: FootballEvent
): boolean {

  const allowedEvents = [

    "pass",
    "successful_pass",
    "key_pass",
    "cross",
    "carry",
    "dribble",
    "take_on",

  ];


  if (
    !allowedEvents.includes(event.type)
  ) {

    return false;

  }


  if (!event.successful) {

    return false;

  }


  if (

    event.x === undefined ||
    event.endX === undefined ||
    event.y === undefined ||
    event.endY === undefined

  ) {

    return false;

  }


  /**
   * Pitch coordinate system:
   *
   * 0 ---------------- 100
   *
   * Penalty area begins approximately:
   * x >= 84
   *
   * Entry occurs when:
   * ball starts outside box
   * and finishes inside box
   */

  return (

    event.x < 84 &&
    event.endX >= 84

  );

}



export function calculatePenaltyAreaEntries(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): PenaltyAreaEntriesResult {


  let home = 0;

  let away = 0;



  for (const event of events) {


    if (!event.teamId) {

      continue;

    }


    if (
      !isPenaltyAreaEntry(event)
    ) {

      continue;

    }



    if (
      event.teamId === homeTeamId
    ) {

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