const API_KEY =
  process.env.FOOTBALL_API_KEY;

const BASE_URL =
  "https://api.football-data.org/v4";

const headers = {
  "X-Auth-Token": API_KEY || "",
};

async function safeFetch(url: string) {
  try {
    const res = await fetch(url, {
      headers,
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) {
      console.error(
        "Football API Status:",
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

export async function getLiveScores() {
  const data = await safeFetch(
    `${BASE_URL}/matches`
  );

  return data?.matches || [];
}

export async function getStandings() {
  const data = await safeFetch(
    `${BASE_URL}/competitions/PL/standings`
  );

  return (
    data?.standings?.[0]
      ?.table || []
  );
}

export async function getArsenalNextMatch() {
  const data = await safeFetch(
    `${BASE_URL}/teams/57/matches?status=SCHEDULED`
  );

  return (
    data?.matches?.[0] ||
    null
  );
}