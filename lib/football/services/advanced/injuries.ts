// lib/football/services/advanced/injuries.ts

import { resolveAdvancedProvider } from "../../advancedResolver";

export async function fetchTeamInjuries(
  teamId: number
) {
  return resolveAdvancedProvider()
    .getInjuries(teamId);
}