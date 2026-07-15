// lib/football/repositories/teamRepository.ts

import {
  getFixtures,
  getResults,
  getStandings,
  getTeam,
} from "../index";

import { resolveAdvancedProvider } from "../advancedResolver";
import { supportsAdvancedProvider } from "../supportsAdvanced";

import type {
  PlayerProfile,
  Injury,
} from "../advancedProvider";

export async function fetchTeamOverview(
  teamId: number
) {
  const [
    team,
    fixtures,
    results,
    standings,
  ] = await Promise.all([
    getTeam(teamId),
    getFixtures(),
    getResults(),
    getStandings(),
  ]);

  let players: PlayerProfile[] = [];
  let injuries: Injury[] = [];

  if (supportsAdvancedProvider()) {
    const provider =
      resolveAdvancedProvider();

    [players, injuries] =
      await Promise.all([
        provider.getPlayers(teamId),
        provider.getInjuries(teamId),
      ]);
  }

  return {
    team,
    fixtures,
    results,
    standings,
    players,
    injuries,
  };
}