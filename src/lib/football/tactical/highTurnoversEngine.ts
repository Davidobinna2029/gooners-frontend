import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface HighTurnoversResult {

  home: number;

  away: number;

}



const HIGH_TURNOVER_ACTIONS = [

  "recovery",
  "interception",
  "tackle",
  "duel_won",

];



function isHighTurnover(

  event: FootballEvent

): boolean {


  if (
    !HIGH_TURNOVER_ACTIONS.includes(
      event.type
    )
  ) {

    return false;

  }



  if (
    event.x === undefined
  ) {

    return false;

  }



  /**
   *
   * Pitch:
   *
   * 0 ---------------- 100
   *
   * High turnovers happen
   * in advanced pressing zones.
   *
   * Threshold:
   * x >= 60
   *
   */


  return event.x >= 60;


}




export function calculateHighTurnovers(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): HighTurnoversResult {


  let home = 0;

  let away = 0;



  for (const event of events) {


    if (!event.teamId) {

      continue;

    }



    if (
      !isHighTurnover(event)
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