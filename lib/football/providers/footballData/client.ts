// lib/football/providers/footballData/client.ts

import { footballConfig } from "../../config";
import { FootballApiError } from "../../errors";

const BASE_URL =
  footballConfig.footballData.baseUrl;

const API_KEY =
  footballConfig.footballData.apiKey;

export async function footballDataFetch<T>(
  path: string
): Promise<T> {
  const response = await fetch(
    `${BASE_URL}${path}`,
    {
      headers: {
        "X-Auth-Token": API_KEY,
      },

      next: {
        revalidate:
          footballConfig.cacheTime,
      },
    }
  );

  if (!response.ok) {
    throw new FootballApiError(
      "football-data",
      response.status
    );
  }

  return response.json();
}