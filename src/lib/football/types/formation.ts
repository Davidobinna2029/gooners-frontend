import type {
  Coordinate,
} from "./common";

import type {
  FootballPlayer,
} from "./player";

export interface PositionedPlayer {
  player: FootballPlayer;

  coordinate: Coordinate;
}

export interface FormationDefinition {
  name: string;

  rows: number[];
}