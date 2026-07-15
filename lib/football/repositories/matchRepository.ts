// lib/football/repositories/matchRepository.ts

import { getMatch } from "../index";
import { resolveAdvancedProvider } from "../advancedResolver";

export async function fetchMatch(matchId: number) {
  return getMatch(matchId);
}

export async function getMatchCentre(matchId: number) {
  const provider = resolveAdvancedProvider();

  const match = await fetchMatch(matchId);

  if (!match) {
    return null;
  }

  const [events, statistics, lineups] = await Promise.all([
    provider.getEvents(matchId),
    provider.getStatistics(matchId),
    provider.getLineups(matchId),
  ]);

  return {
    match,
    events,
    statistics,
    lineups,
  };
}