const API_KEY =
  process.env.FOOTBALL_API_KEY;

const BASE_URL =
  "https://api.football-data.org/v4";

const headers = {
  "X-Auth-Token": API_KEY || "",
};

async function fetchAPI(
  endpoint: string
) {
  try {
    const res = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        headers,
        next: {
          revalidate: 60,
        },
      }
    );

    if (!res.ok) {
      console.error(
        "Football API Error:",
        res.status
      );

      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(error);

    return null;
  }
}

/* =========================
   LIVE SCORES
========================= */

export async function getLiveScores() {
  const data = await fetchAPI(
    "/matches"
  );

  return data?.matches || [];
}

/* =========================
   EPL STANDINGS
========================= */

export async function getStandings() {
  const data = await fetchAPI(
    "/competitions/PL/standings"
  );

  return (
    data?.standings?.[0]
      ?.table || []
  );
}

/* =========================
   ARSENAL NEXT MATCH
========================= */

export async function getArsenalNextMatch() {
  const data = await fetchAPI(
    "/teams/57/matches?limit=1&status=SCHEDULED"
  );

  return (
    data?.matches?.[0] ||
    null
  );
}