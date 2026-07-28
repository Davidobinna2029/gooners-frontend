// lib/football/data/apiFootball/mapLineupsToNormalized.ts

import type { NormalizedLineup } from "@/lib/football/data/types";

/* ==========================================================
   RAW PROVIDER SHAPE (API-FOOTBALL)

   Matches GET /fixtures/lineups's documented per-team entry.
========================================================== */

export interface ApiFootballLineupPlayer {
  player: {
    id: number;
    name: string;
    number: number | null;
    pos: string | null;
    /** Formation-slot grid position, e.g. "2:1" — not real pitch coordinates. */
    grid: string | null;
  };
}

export interface ApiFootballLineup {
  team: {
    id: number;
    name: string;
  };
  formation: string | null;
  startXI: ApiFootballLineupPlayer[];
  substitutes: ApiFootballLineupPlayer[];
}

export interface NormalizedLineups {
  home?: NormalizedLineup;
  away?: NormalizedLineup;
}

/* ==========================================================
   PUBLIC API
========================================================== */

export function mapApiFootballLineupsToNormalized(
  lineups: ApiFootballLineup[],
  homeTeamId: number,
  awayTeamId: number
): NormalizedLineups {

  const result: NormalizedLineups = {};

  for (const lineup of lineups) {

    const normalized: NormalizedLineup = {
      formation: lineup.formation ?? undefined,
      startingXI: lineup.startXI.map(entry => entry.player.name),
      substitutes: lineup.substitutes.map(entry => entry.player.name),
    };

    if (lineup.team.id === homeTeamId) {
      result.home = normalized;
    } else if (lineup.team.id === awayTeamId) {
      result.away = normalized;
    } else {
      console.warn(
        `[mapApiFootballLineupsToNormalized] Lineup team id ${lineup.team.id} ` +
        `matched neither home (${homeTeamId}) nor away (${awayTeamId}); skipping.`
      );
    }

  }

  return result;

}