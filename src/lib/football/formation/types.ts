export interface FormationPlayer {
  id: number;
  name: string;
  number?: number;
  position?: string;
  captain?: boolean;
}

export interface FormationCoordinate {
  x: number;
  y: number;
}

export interface PositionedPlayer {
  player: FormationPlayer;
  coordinate: FormationCoordinate;
}

export interface FormationDefinition {
  name: string;
  rows: number[];
}