// src/lib/football/analytics/passNetworkEngine.ts

import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface PassNode {

  id: number;

  name: string;

  x: number;

  y: number;

}

export interface PassConnection {

  from: number;

  to: number;

  count: number;

}

export interface PassNetwork {

  nodes: PassNode[];

  connections: PassConnection[];

}

export function buildPassNetwork(

  events: FootballEvent[],

  teamId: number

): PassNetwork {

  const players = new Map<
    number,
    PassNode
  >();

  const connections = new Map<
    string,
    PassConnection
  >();

  events.forEach((event) => {

    if (
      event.teamId !== teamId
    ) {
      return;
    }

    if (
      !event.playerId
    ) {
      return;
    }

    if (
      !players.has(
        event.playerId
      )
    ) {

      players.set(
        event.playerId,
        {

          id:
            event.playerId,

          name:
            event.playerName ??
            "Player",

          x:
            Math.floor(
              Math.random() * 70 + 15
            ),

          y:
            Math.floor(
              Math.random() * 70 + 15
            ),

        }
      );

    }

  });

  const ids =
    Array.from(
      players.keys()
    );

  for (
    let i = 0;
    i < ids.length - 1;
    i++
  ) {

    const key =
      `${ids[i]}-${ids[i + 1]}`;

    connections.set(
      key,
      {

        from:
          ids[i],

        to:
          ids[i + 1],

        count:
          Math.floor(
            Math.random() * 25 + 5
          ),

      }
    );

  }

  return {

    nodes:
      Array.from(
        players.values()
      ),

    connections:
      Array.from(
        connections.values()
      ),

  };

}