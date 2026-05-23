const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard";

export async function fetchLiveMatches() {
  try {
    const res = await fetch(ESPN_URL, {
      next: { revalidate: 15 },
    });

    if (!res.ok) return [];

    const data = await res.json();

    return data?.events || [];
  } catch (e) {
    console.error("ESPN fetch failed", e);
    return [];
  }
}