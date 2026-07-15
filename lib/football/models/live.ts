import type { Match } from "../types/match";

import type {
  MatchEvent,
  MatchStatistic,
  TeamLineup,
} from "../advancedProvider";

export interface LiveMatch {
  match: Match;

  events: MatchEvent[];

  statistics: MatchStatistic[];

  lineups: TeamLineup[];
}