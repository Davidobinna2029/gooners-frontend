// lib/football/services/advanced/players.ts

import { resolveAdvancedProvider } from "../../advancedResolver";

export async function fetchPlayers(
  teamId: number
) {
  return resolveAdvancedProvider()
    .getPlayers(teamId);
}