import type {
  PlayerProfile,
  Injury,
} from "../advancedProvider";

import type { Match } from "../types/match";

export interface PlayerOverview {
  profile: PlayerProfile;

  injuries: Injury[];

  recentMatches: Match[];
}