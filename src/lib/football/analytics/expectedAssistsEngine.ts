import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface ExpectedAssistsResult {

  home: number;

  away: number;

}



function calculatePassXGValue(

  events: FootballEvent[],

  index: number

): number {


  const event =
    events[index];


  let value = 0;



  /**
   * Direct assists carry
   * highest creation value
   */

  if (
    event.type === "assist"
  ) {

    value += 0.35;

  }



  /**
   * Key passes create
   * significant chances
   */

  if (
    event.type === "key_pass"
  ) {

    value += 0.25;

  }



  /**
   * Progressive attacking
   * passes increase value
   */

  if (
    event.progressive
  ) {

    value += 0.10;

  }



  /**
   * Expected Threat contribution
   */

  if (
    event.xT
  ) {

    value += event.xT;

  }



  /**
   * If followed by shot,
   * inherit shot quality
   */

  const nextEvent =
    events[index + 1];



  if (

    nextEvent &&

    (
      nextEvent.type === "shot" ||
      nextEvent.type === "shot_on_target"
    )

  ) {


    if (
      nextEvent.xG
    ) {

      value += nextEvent.xG;

    }


  }



  return value;


}




export function calculateExpectedAssists(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): ExpectedAssistsResult {


  let home = 0;

  let away = 0;



  events.forEach(

    (event, index) => {


      const creationEvents = [

        "assist",

        "key_pass",

      ];



      if (

        !creationEvents.includes(
          event.type
        )

      ) {

        return;

      }



      if (
        !event.teamId
      ) {

        return;

      }



      const value =
        calculatePassXGValue(
          events,
          index
        );



      if (

        event.teamId === homeTeamId

      ) {

        home += value;

      }


      else if (

        event.teamId === awayTeamId

      ) {

        away += value;

      }


    }

  );



  return {

    home:
      Number(
        home.toFixed(2)
      ),


    away:
      Number(
        away.toFixed(2)
      ),

  };


}