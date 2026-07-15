// lib/football/services/advanced/events.ts

import { resolveAdvancedProvider } from "../../advancedResolver";

export async function fetchMatchEvents(
  matchId: number
) {
  return resolveAdvancedProvider()
    .getEvents(matchId);
}