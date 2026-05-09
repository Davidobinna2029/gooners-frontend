const BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1";

/* =========================
   SAFE FETCH
========================= */

async function fetchAPI(
  endpoint: string
) {
  try {
    const res = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(
        "ESPN API Error:",
        res.status
      );

      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(
      "ESPN Fetch Error:",
      error
    );

    return null;
  }
}

/* =========================
   LIVE SCORES
========================= */

export async function getLiveScores() {
  const data = await fetchAPI(
    "/scoreboard"
  );

  return (
    data?.events || []
  );
}

/* =========================
   EPL STANDINGS
========================= */

export async function getStandings() {
  const data = await fetch(
    "https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings",
    {
      cache: "no-store",
    }
  );

  const json =
    await data.json();

  return (
    json?.children?.[0]
      ?.standings?.entries ||
    []
  );
}

/* =========================
   NEXT ARSENAL MATCH
========================= */

export async function getArsenalNextMatch() {
  const data = await fetchAPI(
    "/scoreboard"
  );

  const matches =
    data?.events || [];

  const arsenalMatch =
    matches.find(
      (match: any) =>
        match?.competitions?.[0]
          ?.competitors?.some(
            (team: any) =>
              team.team.displayName ===
              "Arsenal"
          )
    );

  return arsenalMatch || null;
}