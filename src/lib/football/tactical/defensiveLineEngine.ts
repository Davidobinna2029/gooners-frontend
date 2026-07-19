// src/lib/football/tactical/defensiveLineEngine.ts

import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface DefensiveLineData {

  home: number;

  away: number;

  homeBlock: "HIGH" | "MEDIUM" | "LOW";

  awayBlock: "HIGH" | "MEDIUM" | "LOW";

}



function calculateBlock(
  height: number
): "HIGH" | "MEDIUM" | "LOW" {


  if (height >= 65) {

    return "HIGH";

  }


  if (height >= 35) {

    return "MEDIUM";

  }


  return "LOW";

}



export function calculateDefensiveLineHeight(
  events: FootballEvent[],
  homeTeamId: number,
  awayTeamId: number
): DefensiveLineData {


  let homePositionEvents = 0;

  let awayPositionEvents = 0;


  let homeHeightTotal = 0;

  let awayHeightTotal = 0;



  for (const event of events) {


    /**
     * Defensive positioning estimate.
     *
     * In live feeds without tracking coordinates,
     * defensive actions are used as a proxy.
     */


    const defensiveAction =

      event.type === "tackle" ||
      event.type === "interception" ||
      event.type === "clearance" ||
      event.type === "recovery";



    if (!defensiveAction) {

      continue;

    }



    const estimatedHeight =
      event.minute < 30
        ? 55
        : event.minute < 60
        ? 50
        : 45;



    if (event.teamId === homeTeamId) {


      homeHeightTotal += estimatedHeight;

      homePositionEvents++;


    }



    if (event.teamId === awayTeamId) {


      awayHeightTotal += estimatedHeight;

      awayPositionEvents++;


    }


  }



  const homeHeight =

    homePositionEvents > 0

      ? Math.round(
          homeHeightTotal /
          homePositionEvents
        )

      : 50;



  const awayHeight =

    awayPositionEvents > 0

      ? Math.round(
          awayHeightTotal /
          awayPositionEvents
        )

      : 50;



  return {


    home: homeHeight,


    away: awayHeight,


    homeBlock:
      calculateBlock(
        homeHeight
      ),


    awayBlock:
      calculateBlock(
        awayHeight
      ),


  };


}