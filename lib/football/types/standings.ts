// lib/football/types/standings.ts

import type { Team } from "./team";

export interface Standing {
  position: number;

  team: Team;

  played: number;

  won: number;

  draw: number;

  lost: number;

  goalsFor: number;

  goalsAgainst: number;

  goalDifference: number;

  points: number;

  form?: string;
}