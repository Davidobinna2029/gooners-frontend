import type {
  FootballCoach,
} from "./coach";

import type {
  FootballPlayer,
} from "./player";

import type {
  ID,
} from "./common";

export interface FootballLineup {
  teamId: ID;

  formation: string;

  coach: FootballCoach;

  startingXI: FootballPlayer[];

  substitutes: FootballPlayer[];
}