// src/lib/football/analytics/shotMapEngine.ts

import type {
  FootballEvent,
} from "@/src/lib/football/types";


export type ShotOutcome =
  | "goal"
  | "saved"
  | "missed"
  | "blocked";


export interface ShotMapEvent {

  id: string;

  teamId: number;

  playerName?: string;

  minute: number;

  x: number;

  y: number;

  outcome: ShotOutcome;

  xg?: number;

}


export function buildShotMap(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): ShotMapEvent[] {


  return events

    .filter(
      (event) =>
        event.type === "shot" ||
        event.type === "goal"
    )

    .map(
      (event) => {

        const outcome =
          event.type === "goal"
            ? "goal"
            : "saved";


        return {

          id: String(event.id),

          teamId:
            Number(event.teamId),

          playerName:
            event.playerName,

          minute:
            event.minute,

          /**
           * Temporary positioning.
           *
           * Later this will use
           * provider shot coordinates.
           */
          x:
            Math.floor(
              Math.random() * 60 + 20
            ),

          y:
            Math.floor(
              Math.random() * 80 + 10
            ),


          outcome,

          xg:
            event.type === "goal"
              ? 0.35
              : 0.10,

        };

      }

    );

}