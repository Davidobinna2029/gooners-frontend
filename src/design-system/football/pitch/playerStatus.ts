export type PlayerStatus =
  | "normal"
  | "captain"
  | "goal"
  | "yellow"
  | "red"
  | "subbed"
  | "injured"
  | "mvp";

export interface PlayerDecorations {
  status?: PlayerStatus;
  rating?: number;
}