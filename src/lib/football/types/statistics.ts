import type {
  TeamSide,
} from "./common";

export interface TeamStatistic {
  side: TeamSide;

  possession: number;

  shots: number;

  shotsOnTarget: number;

  corners: number;

  fouls: number;

  offsides: number;

  yellowCards: number;

  redCards: number;

  passes: number;

  passAccuracy: number;

  expectedGoals?: number;
}