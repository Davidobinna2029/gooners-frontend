import type {
  ID,
} from "./common";

export interface FootballCoach {
  id: ID;

  name: string;

  nationality?: string;

  photo?: string;
}