const API_KEY =
  process.env.FOOTBALL_API_KEY;

const BASE_URL =
  "https://api.football-data.org/v4";

/* ===================================
   SAFE FETCH CORE
=================================== */
async function footballFetch(
  endpoint: string
) {
  if (!API_KEY) {
    console.error(
      "Missing FOOTBALL_API_KEY"
    );
    return null;
  }

  try {
    const res = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        headers: {
          "X-Auth-Token":
            API_KEY,
        },
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
    console.error(
      "Football fetch failed"
    );
    return null;
  }
}

/* ===================================
   LIVE MATCHES
=================================== */
export async function getLiveScores() {
  const data =
    await footballFetch(
      "/matches"
    );

  return data?.matches || [];
}

/* ===================================
   PREMIER LEAGUE TABLE
=================================== */
export async function getStandings() {
  const data =
    await footballFetch(
      "/competitions/PL/standings"
    );

  return (
    data?.standings?.[0]
      ?.table || []
  );
}

/* ===================================
   ARSENAL NEXT MATCH
=================================== */
export async function getNextMatch() {
  const data =
    await footballFetch(
      "/teams/57/matches?status=SCHEDULED&limit=1"
    );

  return (
    data?.matches?.[0] ||
    null
  );
}