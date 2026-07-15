import type { Match } from "../types/match";
import type { Standing } from "../types/standings";
import type { TeamOverview } from "./team";

export interface FootballDashboard {
  nextMatch: Match | null;

  fixtures: Match[];

  results: Match[];

  standings: Standing[];

  team: TeamOverview;
}