// src/lib/football/formation/types.ts

export interface FormationCoordinate {
  x: number;
  y: number;
}

export interface PositionedPlayer {
  id: number;

  name: string;

  number?: number;

  position?: string;

  captain?: boolean;

  x: number;

  y: number;
}

export interface FormationDefinition {
  name: string;

  rows: number[];
}