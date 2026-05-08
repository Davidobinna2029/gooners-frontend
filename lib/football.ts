const API_KEY =
  process.env.FOOTBALL_API_KEY;

const BASE_URL =
  "https://api.football-data.org/v4";

const headers = {
  "X-Auth-Token": API_KEY || "",
};

export async function getLiveScores() {
  try {
    const res = await fetch(
      `${BASE_URL}/matches`,
      {
        headers,
        next: {
          revalidate: 60,
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch live scores"
      );
    }

    const data =
      await res.json();

    return (
      data.matches || []
    );
  } catch (error) {
    console.error(
      "LiveScores Error:",
      error
    );

    return [];
  }
}

export async function getStandings() {
  try {
    const res = await fetch(
      `${BASE_URL}/competitions/PL/standings`,
      {
        headers,
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch standings"
      );
    }

    const data =
      await res.json();

    return (
      data.standings?.[0]
        ?.table || []
    );
  } catch (error) {
    console.error(
      "Standings Error:",
      error
    );

    return [];
  }
}

export async function getArsenalNextMatch() {
  try {
    const res = await fetch(
      `${BASE_URL}/teams/57/matches?status=SCHEDULED&limit=1`,
      {
        headers,
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch next match"
      );
    }

    const data =
      await res.json();

    return (
      data.matches?.[0] ||
      null
    );
  } catch (error) {
    console.error(
      "NextMatch Error:",
      error
    );

    return null;
  }
}