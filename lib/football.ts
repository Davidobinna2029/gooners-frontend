const API_KEY =
  process.env.FOOTBALL_API_KEY;

const BASE_URL =
  "https://v3.football.api-sports.io";

async function footballFetch(
  endpoint: string
) {
  try {
    const res = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        headers: {
          "x-apisports-key":
            API_KEY || "",
        },
        next: {
          revalidate: 60,
        },
      }
    );

    const data =
      await res.json();

    return data.response || [];
  } catch {
    return [];
  }
}

export async function getLiveScores() {
  return await footballFetch(
    "/fixtures?live=all"
  );
}

export async function getArsenalNextMatch() {
  const data =
    await footballFetch(
      "/fixtures?team=42&next=1"
    );

  return data[0] || null;
}

export async function getPremierLeagueStandings() {
  const data =
    await footballFetch(
      "/standings?league=39&season=2025"
    );

  return (
    data?.[0]
      ?.league
      ?.standings?.[0] || []
  );
}