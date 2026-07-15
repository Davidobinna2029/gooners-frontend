import type { Match } from "../types/match";
import type { Standing } from "../types/standings";
import type {
  PlayerProfile,
  Injury,
} from "../advancedProvider";

import type { Team } from "../types/team";

export interface TeamOverview {
  team: Team | null;

  fixtures: Match[];

  results: Match[];

  standings: Standing[];

  players: PlayerProfile[];

  injuries: Injury[];
}