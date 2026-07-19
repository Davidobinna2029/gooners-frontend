// src/lib/football/analytics/heatMapEngine.ts

import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface HeatPoint {

  x: number;

  y: number;

  intensity: number;

}


export interface PlayerHeatMap {

  playerId?: number;

  playerName?: string;

  points: HeatPoint[];

}



export function buildHeatMap(

  events: FootballEvent[],

  teamId: number

): PlayerHeatMap {


  const points: HeatPoint[] = [];


  events.forEach((event) => {


    if (event.teamId !== teamId) {

      return;

    }


    /**
     * Temporary coordinates.
     *
     * Later replaced with
     * provider positional data.
     */


    let intensity = 1;


    switch (event.type) {

      case "goal":

        intensity = 5;

        break;


      case "shot":

        intensity = 4;

        break;


      case "corner":

        intensity = 3;

        break;


      case "foul":

        intensity = 2;

        break;


      default:

        intensity = 1;

    }


    points.push({

      x:
        Math.floor(
          Math.random() * 80 + 10
        ),


      y:
        Math.floor(
          Math.random() * 80 + 10
        ),


      intensity,

    });


  });


  return {

    points,

  };

}