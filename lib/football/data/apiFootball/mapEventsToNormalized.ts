// lib/football/data/apiFootball/mapEventsToNormalized.ts

import type { NormalizedEvent } from "@/lib/football/data/types";

/* ==========================================================
   RAW PROVIDER SHAPE (API-FOOTBALL)

   Matches GET /fixtures/events's documented per-event entry.
========================================================== */

export interface ApiFootballEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
  };
  player: {
    id: number | null;
    name: string | null;
  };
  assist?: {
    id: number | null;
    name: string | null;
  } | null;
  /** Known values: "Goal" | "Card" | "subst" | "Var" — kept as string since the API may add more */
  type: string;
  detail: string;
}

/* ==========================================================
   PUBLIC API
========================================================== */

/**
 * Maps raw API-Football events into NormalizedEvent[] — the
 * single normalized representation MatchData.events carries.
 * Anything downstream (momentum, timelines, etc.) should consume
 * NormalizedEvent, never this raw shape directly.
 */
export function mapApiFootballEventsToNormalized(
  events: ApiFootballEvent[],
  homeTeamId: number,
  awayTeamId: number
): NormalizedEvent[] {

  const result: NormalizedEvent[] = [];

  for (const event of events) {

    let team: "home" | "away";

    if (event.team.id === homeTeamId) {
      team = "home";
    } else if (event.team.id === awayTeamId) {
      team = "away";
    } else {
      console.warn(
        `[mapApiFootballEventsToNormalized] Event team id ${event.team.id} ` +
        `matched neither home (${homeTeamId}) nor away (${awayTeamId}); skipping.`
      );
      continue;
    }

    result.push({
      minute: event.time.elapsed,
      type: event.type,
      team,
      player: event.player.name ?? undefined,
      assist: event.assist?.name ?? undefined,
      detail: event.detail,
    });

  }

  return result;

}