// lib/football/data/apiFootball/client.ts

import type { ApiFootballFixture } from "./mapMatchToNormalized";
import type { ApiFootballEvent } from "./mapEventsToNormalized";
import type { ApiFootballLineup } from "./mapLineupsToNormalized";
import type { ApiFootballPlayerStatistics } from "./mapPlayersToNormalized";

const API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";

/**
 * Sign up at https://www.api-football.com and set this env var
 * before calling anything in this file. Uses the self-hosted
 * api-sports.io host + x-apisports-key header (the documented
 * default route) rather than the RapidAPI-hosted alternative,
 * which uses different headers — switch this if you sign up via
 * RapidAPI instead.
 */
function getApiKey(): string {

  const key = process.env.API_FOOTBALL_KEY;

  if (!key) {
    throw new Error(
      "API_FOOTBALL_KEY is not set. Sign up at https://www.api-football.com " +
      "and set this environment variable before calling the API-Football client."
    );
  }

  return key;

}

async function apiFootballGet<T>(path: string): Promise<T[]> {

  const response = await fetch(`${API_FOOTBALL_BASE_URL}${path}`, {
    headers: {
      "x-apisports-key": getApiKey(),
    },
  });

  if (!response.ok) {
    throw new Error(
      `API-Football request failed: ${response.status} ${response.statusText} (${path})`
    );
  }

  const body = (await response.json()) as { response: T[] };

  return body.response;

}

/* ==========================================================
   PUBLIC API
========================================================== */

export async function getFixture(fixtureId: number): Promise<ApiFootballFixture> {

  const results = await apiFootballGet<ApiFootballFixture>(`/fixtures?id=${fixtureId}`);

  const fixture = results[0];

  if (!fixture) {
    throw new Error(`No fixture found for id ${fixtureId}`);
  }

  return fixture;

}

export async function getFixtureEvents(fixtureId: number): Promise<ApiFootballEvent[]> {
  return apiFootballGet<ApiFootballEvent>(`/fixtures/events?fixture=${fixtureId}`);
}

export async function getFixtureLineups(fixtureId: number): Promise<ApiFootballLineup[]> {
  return apiFootballGet<ApiFootballLineup>(`/fixtures/lineups?fixture=${fixtureId}`);
}

/**
 * API-Football groups /fixtures/players by team rather than
 * returning a flat player list — the caller matches team.id
 * against the fixture's home/away team ids to know which block is
 * which (see loadMatchData.ts).
 */
export interface ApiFootballPlayersByTeam {
  team: {
    id: number;
    name: string;
  };
  players: ApiFootballPlayerStatistics[];
}

export async function getFixturePlayers(
  fixtureId: number
): Promise<ApiFootballPlayersByTeam[]> {
  return apiFootballGet<ApiFootballPlayersByTeam>(`/fixtures/players?fixture=${fixtureId}`);
}