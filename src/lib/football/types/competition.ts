import type {
  ID,
} from "./common";

export interface FootballCompetition {
  id: ID;

  name: string;

  code?: string;

  country?: string;

  logo?: string;

  season?: number;
}