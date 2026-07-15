// lib/football/services/advanced/lineups.ts

import { resolveAdvancedProvider } from "../../advancedResolver";

export async function fetchMatchLineups(
  matchId: number
) {
  return resolveAdvancedProvider()
    .getLineups(matchId);
}