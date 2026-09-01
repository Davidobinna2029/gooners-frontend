import type { ApiFootballFixture } from "./mapMatchToNormalized";
import type { ApiFootballEvent } from "./mapEventsToNormalized";
import type { ApiFootballLineup } from "./mapLineupsToNormalized";
import type { ApiFootballPlayerStatistics } from "./mapPlayersToNormalized";

const API_FOOTBALL_BASE_URL =
  process.env.API_FOOTBALL_BASE_URL ||
  "https://v3.football.api-sports.io";

/* ==========================================================
   API KEY
========================================================== */

function getApiKey(): string {
  const key = process.env.API_FOOTBALL_KEY;

  if (!key || key.trim().length === 0) {
    throw new Error(
      "API_FOOTBALL_KEY is missing from .env.local"
    );
  }

  return key;
}

/* ==========================================================
   HTTP CLIENT
========================================================== */

async function apiFootballGet<T>(
  path: string
): Promise<T[]> {

  const response = await fetch(
    `${API_FOOTBALL_BASE_URL}${path}`,
    {
      headers: {
        "x-apisports-key": getApiKey(),
        Accept: "application/json",
      },

      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `API-Football request failed: ${response.status} ${response.statusText} (${path})`
    );
  }

  const body =
    (await response.json()) as {
      response?: T[];
      errors?: unknown;
    };

  if (!Array.isArray(body.response)) {
    throw new Error(
      `API-Football returned an invalid response (${path})`
    );
  }

  return body.response;
}

/* ==========================================================
   FIXTURE
========================================================== */

export async function getFixture(
  fixtureId: number
): Promise<ApiFootballFixture> {

  const results =
    await apiFootballGet<ApiFootballFixture>(
      `/fixtures?id=${fixtureId}`
    );

  const fixture = results[0];

  if (!fixture) {
    throw new Error(
      `No fixture found for id ${fixtureId}`
    );
  }

  return fixture;
}

/* ==========================================================
   EVENTS
========================================================== */

export async function getFixtureEvents(
  fixtureId: number
): Promise<ApiFootballEvent[]> {

  return apiFootballGet<ApiFootballEvent>(
    `/fixtures/events?fixture=${fixtureId}`
  );
}

/* ==========================================================
   LINEUPS
========================================================== */

export async function getFixtureLineups(
  fixtureId: number
): Promise<ApiFootballLineup[]> {

  return apiFootballGet<ApiFootballLineup>(
    `/fixtures/lineups?fixture=${fixtureId}`
  );
}

/* ==========================================================
   PLAYERS
========================================================== */

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

  return apiFootballGet<ApiFootballPlayersByTeam>(
    `/fixtures/players?fixture=${fixtureId}`
  );
}