// lib/football/providers/apiFootball/client.ts

const API_FOOTBALL_BASE_URL =
  process.env.API_FOOTBALL_BASE_URL ??
  "https://v3.football.api-sports.io";

const API_FOOTBALL_KEY =
  process.env.API_FOOTBALL_KEY;

export async function apiFootballFetch<T>(
  endpoint: string
): Promise<T> {
  if (!API_FOOTBALL_KEY) {
    throw new Error(
      "Missing API_FOOTBALL_KEY environment variable."
    );
  }

  const response = await fetch(
    `${API_FOOTBALL_BASE_URL}${endpoint}`,
    {
      headers: {
        "x-apisports-key": API_FOOTBALL_KEY,
      },

      next: {
        revalidate: 60,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `API-Football request failed (${response.status})`
    );
  }

  return response.json();
}