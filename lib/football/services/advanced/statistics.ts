// lib/football/services/advanced/statistics.ts

import { resolveAdvancedProvider } from "../../advancedResolver";

export async function fetchMatchStatistics(
  matchId: number
) {
  return resolveAdvancedProvider()
    .getStatistics(matchId);
}