export type ID = number;

export type ISODateString = string;

export type TeamSide =
  | "home"
  | "away";

export interface Coordinate {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}