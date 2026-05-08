const API_KEY =
  process.env.FOOTBALL_API_KEY;

const BASE_URL =
  "https://api.football-data.org/v4";

async function fetchAPI(
  endpoint: string
) {
  try {
    const res = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        headers: {
          "X-Auth-Token":
            API_KEY || "",
        },
        cache: "no-store",
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
    console.error(
      "Football Fetch Error:",
      error
    );

    return null;
  }
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
   LIVE SCORES
========================= */

export async function getLiveScores() {
  return [];
}

/* =========================
   NEXT MATCH
========================= */

export async function getArsenalNextMatch() {
  return null;
}