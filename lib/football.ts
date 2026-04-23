const API_KEY = process.env.FOOTBALL_API_KEY;

const BASE_URL = "https://v3.football.api-sports.io";

const headers = {
  "x-apisports-key": API_KEY || "",
};

if (!API_KEY) {
  console.warn("Missing FOOTBALL_API_KEY");
}

async function apiFetch(
  endpoint: string,
  revalidate: number = 60
) {
  try {
    const res = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        headers,
        next: { revalidate },
      }
    );

    if (!res.ok) {
      console.error(
        "Football API error:",
        res.status
      );
      return [];
    }

    const data = await res.json();

    return data.response || [];
  } catch (error) {
    console.error(
      "Football fetch failed:",
      error
    );

    return [];
  }
}

/* Live games */
export async function getLiveScores() {
  return await apiFetch(
    "/fixtures?live=all",
    30
  );
}

/* Arsenal next match */
export async function getArsenalNextMatch() {
  const data = await apiFetch(
    "/fixtures?team=42&next=1",
    300
  );

  return data[0] || null;
}

/* Arsenal next 5 fixtures */
export async function getArsenalFixtures() {
  return await apiFetch(
    "/fixtures?team=42&next=5",
    300
  );
}

/* EPL Table */
export async function getPremierLeagueStandings() {
  const data = await apiFetch(
    "/standings?league=39&season=2026",
    600
  );

  return (
    data[0]?.league?.standings?.[0] ||
    []
  );
}