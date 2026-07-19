import type {
  ID,
} from "./common";

export interface FootballTeam {
  id: ID;

  name: string;

  shortName?: string;

  code?: string;

  logo?: string;

  colors?: {
    primary: string;
    secondary: string;
  };
}