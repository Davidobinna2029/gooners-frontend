// src/lib/football/tactical/attackingWidthEngine.ts

import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface AttackingWidthData {

  home: number;

  away: number;

  homeLeftChannel: number;

  homeRightChannel: number;

  awayLeftChannel: number;

  awayRightChannel: number;

  homeFinalThirdEntries: number;

  awayFinalThirdEntries: number;

}



export function calculateAttackingWidth(
  events: FootballEvent[],
  homeTeamId: number,
  awayTeamId: number
): AttackingWidthData {


  let homeWidthTotal = 0;

  let awayWidthTotal = 0;


  let homeEvents = 0;

  let awayEvents = 0;


  let homeLeft = 0;

  let homeRight = 0;

  let awayLeft = 0;

  let awayRight = 0;


  let homeFinalThird = 0;

  let awayFinalThird = 0;



  for (const event of events) {


    const attackingAction =

      event.type === "cross" ||
      event.type === "key_pass" ||
      event.type === "shot" ||
      event.type === "successful_pass";



    if (!attackingAction) {

      continue;

    }



    /**
     * Without tracking coordinates,
     * use event minute and action type
     * as positional estimation.
     *
     * Future upgrade:
     * Opta / StatsBomb coordinates.
     */


    const estimatedWidth =
      event.type === "cross"
        ? 75
        : 55;



    const leftSide =
      event.minute % 2 === 0;



    const finalThirdEntry =
      event.type === "shot" ||
      event.type === "key_pass";



    if (event.teamId === homeTeamId) {


      homeWidthTotal += estimatedWidth;

      homeEvents++;



      if (leftSide) {

        homeLeft++;

      } else {

        homeRight++;

      }



      if (finalThirdEntry) {

        homeFinalThird++;

      }


    }



    if (event.teamId === awayTeamId) {


      awayWidthTotal += estimatedWidth;

      awayEvents++;



      if (leftSide) {

        awayLeft++;

      } else {

        awayRight++;

      }



      if (finalThirdEntry) {

        awayFinalThird++;

      }


    }


  }



  const homeWidth =

    homeEvents > 0

      ? Math.round(
          homeWidthTotal /
          homeEvents
        )

      : 50;



  const awayWidth =

    awayEvents > 0

      ? Math.round(
          awayWidthTotal /
          awayEvents
        )

      : 50;



  return {


    home: homeWidth,


    away: awayWidth,


    homeLeftChannel:
      homeEvents
        ? Math.round(
            (homeLeft / homeEvents) * 100
          )
        : 50,


    homeRightChannel:
      homeEvents
        ? Math.round(
            (homeRight / homeEvents) * 100
          )
        : 50,



    awayLeftChannel:
      awayEvents
        ? Math.round(
            (awayLeft / awayEvents) * 100
          )
        : 50,



    awayRightChannel:
      awayEvents
        ? Math.round(
            (awayRight / awayEvents) * 100
          )
        : 50,



    homeFinalThirdEntries:
      homeFinalThird,


    awayFinalThirdEntries:
      awayFinalThird,


  };


}