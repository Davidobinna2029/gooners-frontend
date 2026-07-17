// src/lib/football/formation/formationEngine.ts

import {
  DEFAULT_FORMATION,
  FORMATIONS,
} from "./formations";

import type {
  FormationCoordinate,
  FormationPlayer,
  PositionedPlayer,
} from "./types";

const GOALKEEPER: FormationCoordinate = {
  x: 50,
  y: 92,
};

function buildRowCoordinates(
  playersInRow: number,
  y: number
): FormationCoordinate[] {
  if (playersInRow <= 0) return [];

  const spacing = 100 / (playersInRow + 1);

  return Array.from(
    { length: playersInRow },
    (_, index) => ({
      x: spacing * (index + 1),
      y,
    })
  );
}

export function buildFormation(
  formation: string,
  players: FormationPlayer[]
): PositionedPlayer[] {
  if (!players.length) {
    return [];
  }

  const definition =
    FORMATIONS[formation] ??
    DEFAULT_FORMATION;

  const goalkeeper = players[0];

  const outfield = players.slice(1);

  const positioned: PositionedPlayer[] = [
    {
      player: goalkeeper,
      coordinate: GOALKEEPER,
    },
  ];

  const rows = definition.rows;

  const rowSpacing =
    80 / (rows.length + 1);

  let playerIndex = 0;

  rows.forEach((playersInRow, rowIndex) => {
    const y =
      80 -
      rowSpacing * rowIndex;

    const coordinates =
      buildRowCoordinates(
        playersInRow,
        y
      );

    coordinates.forEach((coordinate) => {
      const player =
        outfield[playerIndex];

      if (!player) return;

      positioned.push({
        player,
        coordinate,
      });

      playerIndex++;
    });
  });

  return positioned;
}