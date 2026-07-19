// src/lib/football/formation/formationEngine.ts

import {
  formationCoordinates,
} from "./formationCoordinates";

import type {
  PositionedPlayer,
} from "./types";

export interface FormationPlayer {
  id: number;

  name: string;

  number?: number;

  position?: string;

  captain?: boolean;
}

export function buildFormation(
  formation: string,
  players: FormationPlayer[]
): PositionedPlayer[] {

  const coordinates =
    formationCoordinates[formation];

  if (!coordinates) {

    console.warn(
      `Unknown formation: ${formation}`
    );

    return [];

  }

  return players.map((player, index) => {

    const coordinate =
      coordinates[index] ??
      coordinates[coordinates.length - 1];

    return {

      ...player,

      x: coordinate.x,

      y: coordinate.y,

    };

  });

}