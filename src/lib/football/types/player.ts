import type {
  ID,
} from "./common";

export interface FootballPlayer {
  id: ID;

  name: string;

  shortName?: string;

  number?: number;

  position?: string;

  captain?: boolean;

  starter?: boolean;

  substitute?: boolean;

  rating?: number;

  shirtColor?: string;

  textColor?: string;

  photo?: string;

  teamId?: ID;

  age?: number;

  nationality?: string;
}