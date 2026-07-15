// lib/football/provider.ts

import type { Match } from "./types/match";
import type { Fixture } from "./types/fixture";
import type { Standing } from "./types/standings";
import type { Team } from "./types/team";

export interface FootballProvider {
  getNextMatch(): Promise<Match | null>;

  getFixtures(): Promise<Fixture[]>;

  getResults(): Promise<Fixture[]>;

  getStandings(): Promise<Standing[]>;

  getMatch(
    id: number
  ): Promise<Match | null>;

  getTeam(
    id: number
  ): Promise<Team | null>;
}