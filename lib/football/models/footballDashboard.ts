// lib/football/models/footballDashboard.ts

import type { Match } from "../types/match";
import type { Standing } from "../types/standings";
import type { Team } from "../types/team";

import type {
  PlayerProfile,
  Injury,
} from "../advancedProvider";

export interface TeamOverview {
  team: Team | null;

  fixtures: Match[];

  results: Match[];

  standings: Standing[];

  players: PlayerProfile[];

  injuries: Injury[];
}

export interface FootballDashboard {
  nextMatch: Match | null;

  fixtures: Match[];

  results: Match[];

  standings: Standing[];

  team: TeamOverview;
}