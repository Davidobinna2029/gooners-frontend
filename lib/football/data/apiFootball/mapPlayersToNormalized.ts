// lib/football/data/apiFootball/mapPlayersToNormalized.ts

import type { NormalizedPlayerStats } from "@/lib/football/data/types";

/* ==========================================================
   RAW PROVIDER SHAPE (API-FOOTBALL)

   Matches GET /fixtures/players's documented per-player entry.
   Numeric-looking fields (rating, accuracy) come back as strings
   from the real API. Built from documentation, not a captured
   live payload — verify field names against a real response
   before trusting this in production.
========================================================== */

export interface ApiFootballPlayerGames {
  minutes: number | null;
  number: number | null;
  position: string | null;
  rating: string | null;
  captain: boolean | null;
  substitute: boolean | null;
}

export interface ApiFootballPlayerShots {
  total: number | null;
  on: number | null;
}

export interface ApiFootballPlayerGoals {
  total: number | null;
  assists: number | null;
}

export interface ApiFootballPlayerPasses {
  total: number | null;
  key: number | null;
  accuracy: string | null;
}

export interface ApiFootballPlayerTackles {
  total: number | null;
  interceptions: number | null;
}

export interface ApiFootballPlayerDuels {
  total: number | null;
  won: number | null;
}

export interface ApiFootballPlayerDribbles {
  attempts: number | null;
  success: number | null;
}

export interface ApiFootballPlayerFouls {
  drawn: number | null;
  committed: number | null;
}

export interface ApiFootballPlayerCards {
  yellow: number | null;
  red: number | null;
}

export interface ApiFootballPlayerStatisticsEntry {
  games: ApiFootballPlayerGames;
  shots: ApiFootballPlayerShots;
  goals: ApiFootballPlayerGoals;
  passes: ApiFootballPlayerPasses;
  tackles: ApiFootballPlayerTackles;
  duels: ApiFootballPlayerDuels;
  dribbles: ApiFootballPlayerDribbles;
  fouls: ApiFootballPlayerFouls;
  cards: ApiFootballPlayerCards;
}

export interface ApiFootballPlayerStatistics {
  player: {
    id: number;
    name: string;
  };
  /** One entry per fixture normally, hence statistics[0] below. */
  statistics: ApiFootballPlayerStatisticsEntry[];
}

/* ==========================================================
   PUBLIC API
========================================================== */

/**
 * Maps one team's slice of API-Football's /fixtures/players
 * response into NormalizedPlayerStats[]. Players with no
 * statistics entry at all (e.g. an unused substitute the API
 * still lists but never generated a stats block for) are
 * dropped rather than represented as a row of fake zeros.
 */
export function mapApiFootballPlayersToNormalized(
  players: ApiFootballPlayerStatistics[],
  team: "home" | "away"
): NormalizedPlayerStats[] {

  return players

    .filter(entry => entry.statistics.length > 0)

    .map(entry => {

      const stats = entry.statistics[0];

      const ratingParsed =
        stats.games.rating !== null
          ? parseFloat(stats.games.rating)
          : NaN;

      const accuracyParsed =
        stats.passes.accuracy !== null
          ? parseFloat(stats.passes.accuracy)
          : NaN;

      const result: NormalizedPlayerStats = {
        playerId: entry.player.id,
        playerName: entry.player.name,
        team,

        shirtNumber: stats.games.number ?? undefined,
        position: stats.games.position ?? undefined,

        minutesPlayed: stats.games.minutes ?? 0,

        rating: Number.isNaN(ratingParsed) ? undefined : ratingParsed,

        goals: stats.goals.total ?? 0,
        assists: stats.goals.assists ?? 0,

        shots: stats.shots.total ?? 0,
        shotsOnTarget: stats.shots.on ?? 0,

        keyPasses: stats.passes.key ?? 0,
        passesAttempted: stats.passes.total ?? 0,
        passAccuracy: Number.isNaN(accuracyParsed) ? 0 : accuracyParsed,

        tackles: stats.tackles.total ?? 0,
        interceptions: stats.tackles.interceptions ?? 0,
        duelsWon: stats.duels.won ?? 0,
        duelsTotal: stats.duels.total ?? 0,
        dribblesSuccessful: stats.dribbles.success ?? 0,

        foulsCommitted: stats.fouls.committed ?? 0,
        foulsDrawn: stats.fouls.drawn ?? 0,

        yellowCards: stats.cards.yellow ?? 0,
        redCards: stats.cards.red ?? 0,
      };

      return result;

    });

}