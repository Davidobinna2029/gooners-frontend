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
        next: {
          revalidate: 60,
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        `ESPN API Error: ${res.status}`
      );
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
  const data =
    await fetchAPI(
      "/scoreboard"
    );

  return data?.events || [];
}

/* =========================
   STANDINGS
========================= */

export async function getStandings() {
  try {
    const res = await fetch(
      "https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings",
      {
        next: {
          revalidate: 300,
        },
      }
    );

    const data =
      await res.json();

    return (
      data?.children?.[0]
        ?.standings?.entries ||
      []
    );
  } catch (error) {
    console.error(
      "Standings Error:",
      error
    );

    return [];
  }
}

/* =========================
   NEXT ARSENAL MATCH
========================= */

export async function getArsenalNextMatch() {
  const data =
    await fetchAPI(
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
              team.team
                .displayName ===
              "Arsenal"
          )
    );

  return arsenalMatch || null;
}