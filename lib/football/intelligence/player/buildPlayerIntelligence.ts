// lib/football/intelligence/player/buildPlayerIntelligence.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import type { NormalizedPlayerStats } from "@/lib/football/data/types";

import { calculatePlayerMinutes } from "./calculatePlayerMinutes";
import { calculatePlayerRatings } from "./calculatePlayerRatings";
import { calculatePlayerShooting } from "./calculatePlayerShooting";
import { calculatePlayerPassing } from "./calculatePlayerPassing";
import { calculatePlayerDefending } from "./calculatePlayerDefending";
import { calculatePlayerDiscipline } from "./calculatePlayerDiscipline";
import { calculatePlayerContribution } from "./calculatePlayerContribution";

/**
 * Builds PlayerInsight[] for one team from already-normalized
 * player stats (see lib/football/data/types.ts's
 * NormalizedPlayerStats, populated via a provider-specific mapper
 * such as mapApiFootballPlayersToNormalized). Filtering out
 * players with no real stats happens at the mapper stage, not
 * here — by the time data reaches this function it's assumed
 * to be real, provider-agnostic per-player data.
 */
export function buildPlayerIntelligence(
  players: NormalizedPlayerStats[]
): PlayerInsight[] {

  return players.map(stats => {

    const base = {
      playerId: stats.playerId,
      playerName: stats.playerName,
      team: stats.team,
      shirtNumber: stats.shirtNumber,
      position: stats.position,
      ...calculatePlayerMinutes(stats),
      ...calculatePlayerRatings(stats),
      ...calculatePlayerShooting(stats),
      ...calculatePlayerPassing(stats),
      ...calculatePlayerDefending(stats),
      ...calculatePlayerDiscipline(stats),
    };

    const contribution = calculatePlayerContribution(base);

    const insight: PlayerInsight = {
      ...base,
      ...contribution,
    };

    return insight;

  });

}