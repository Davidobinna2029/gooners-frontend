// lib/football/config.ts

export const footballConfig = {
  provider:
    process.env.FOOTBALL_PROVIDER ??
    "football-data",

  cacheTime: Number(
    process.env.FOOTBALL_CACHE_SECONDS ?? 60
  ),

  footballData: {
    baseUrl:
      process.env.FOOTBALL_DATA_BASE_URL ??
      "https://api.football-data.org/v4",

    apiKey:
      process.env.FOOTBALL_DATA_API_KEY ?? "",
  },

  apiFootball: {
    baseUrl:
      process.env.API_FOOTBALL_BASE_URL ??
      "https://v3.football.api-sports.io",

    apiKey:
      process.env.API_FOOTBALL_KEY ?? "",
  },
};