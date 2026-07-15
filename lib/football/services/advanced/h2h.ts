// lib/football/services/advanced/h2h.ts

import { resolveAdvancedProvider } from "../../advancedResolver";

export async function fetchHeadToHead(
  homeTeamId: number,
  awayTeamId: number
) {
  return resolveAdvancedProvider()
    .getHeadToHead(
      homeTeamId,
      awayTeamId
    );
}