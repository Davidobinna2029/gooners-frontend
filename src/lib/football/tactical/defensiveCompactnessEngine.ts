import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface CompactnessMetrics {

  verticalCompactness: number;

  horizontalCompactness: number;

  overall: number;

}


export interface DefensiveCompactnessResult {

  home: CompactnessMetrics;

  away: CompactnessMetrics;

}



const DEFENSIVE_EVENTS = [

  "tackle",

  "interception",

  "clearance",

  "block",

  "recovery",

  "duel_won",

];



function average(

  values: number[]

): number {


  if (!values.length) {

    return 0;

  }


  return (

    values.reduce(

      (sum, value) =>

        sum + value,

      0

    )

    /

    values.length

  );


}



function calculateSpread(

  values: number[]

): number {


  if (!values.length) {

    return 0;

  }


  const mean =
    average(values);


  const variance =

    average(

      values.map(

        (value) =>

          Math.pow(
            value - mean,
            2
          )

      )

    );


  return Math.sqrt(
    variance
  );

}




function calculateTeamCompactness(

  events: FootballEvent[],

  teamId: number

): CompactnessMetrics {


  const positions =
    events.filter(

      (event) =>

        event.teamId === teamId &&

        DEFENSIVE_EVENTS.includes(
          event.type
        ) &&

        event.x !== undefined &&

        event.y !== undefined

    );



  const xPositions =
    positions.map(

      (event) =>

        event.x as number

    );



  const yPositions =
    positions.map(

      (event) =>

        event.y as number

    );



  const xSpread =
    calculateSpread(
      xPositions
    );


  const ySpread =
    calculateSpread(
      yPositions
    );



  /**
   *
   * Smaller spread =
   * more compact team shape.
   *
   * Convert spread into
   * 0-100 score.
   *
   */


  const verticalCompactness =
    Math.max(

      0,

      Math.min(

        100,

        Math.round(
          100 - xSpread
        )

      )

    );



  const horizontalCompactness =
    Math.max(

      0,

      Math.min(

        100,

        Math.round(
          100 - ySpread
        )

      )

    );



  return {

    verticalCompactness,

    horizontalCompactness,

    overall:

      Math.round(

        (
          verticalCompactness +

          horizontalCompactness

        ) / 2

      ),

  };


}




export function calculateDefensiveCompactness(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): DefensiveCompactnessResult {


  return {

    home:

      calculateTeamCompactness(

        events,

        homeTeamId

      ),


    away:

      calculateTeamCompactness(

        events,

        awayTeamId

      ),

  };


}