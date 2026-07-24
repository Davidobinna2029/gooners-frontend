// src/lib/football/data/footballDataClient.ts

import type {
  FootballDataMatchResponse,
} from "./normalizeMatch";

const BASE_URL =
  process.env.FOOTBALL_DATA_BASE_URL ??
  "https://api.football-data.org/v4";

const API_KEY =
  process.env.FOOTBALL_DATA_API_KEY;

export interface FootballDataOptions {
  path: string;
  params?: Record<
    string,
    string | number | boolean | undefined
  >;
}

export class FootballDataError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "FootballDataError";
  }
}

/* ==========================================================
   URL Builder
========================================================== */

function buildUrl({
  path,
  params,
}: FootballDataOptions): string {

  const url = new URL(
    `${BASE_URL}${path}`
  );

  if (params) {

    Object.entries(params).forEach(
      ([key, value]) => {

        if (
          value !== undefined &&
          value !== null
        ) {
          url.searchParams.set(
            key,
            String(value)
          );
        }

      }
    );

  }

  return url.toString();

}

/* ==========================================================
   Generic Fetcher
========================================================== */

export async function footballDataFetch<T>({
  path,
  params,
}: FootballDataOptions): Promise<T> {

  if (!API_KEY) {
    throw new Error(
      "FOOTBALL_DATA_API_KEY is missing."
    );
  }

  const response = await fetch(
    buildUrl({
      path,
      params,
    }),
    {
      headers: {
        "X-Auth-Token": API_KEY,
      },

      next: {
        revalidate: 30,
      },
    }
  );

  if (!response.ok) {

    const body =
      await response.text();

    throw new FootballDataError(
      body,
      response.status
    );

  }

  return response.json() as Promise<T>;

}

/* ==========================================================
   API WRAPPERS
========================================================== */

export function getMatch(
  matchId: number
): Promise<FootballDataMatchResponse> {

  return footballDataFetch<FootballDataMatchResponse>({
    path: `/matches/${matchId}`,
  });

}

export function getTeam(
  teamId: number
) {

  return footballDataFetch({
    path: `/teams/${teamId}`,
  });

}

export function getCompetition(
  competitionCode: string
) {

  return footballDataFetch({
    path: `/competitions/${competitionCode}`,
  });

}

export function getStandings(
  competitionCode: string
) {

  return footballDataFetch({
    path: `/competitions/${competitionCode}/standings`,
  });

}

export function getMatchesByCompetition(
  competitionCode: string
) {

  return footballDataFetch({
    path: `/competitions/${competitionCode}/matches`,
  });

}

export function getTodayMatches() {

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  return footballDataFetch({
    path: "/matches",

    params: {
      dateFrom: today,
      dateTo: today,
    },
  });

}