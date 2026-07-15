import type { Match } from "../types/match";
import type { Standing } from "../types/standings";

export interface CompetitionOverview {
  standings: Standing[];

  fixtures: Match[];

  results: Match[];
}