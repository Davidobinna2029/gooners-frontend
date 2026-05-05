const BASE_URL = "https://api.football-data.org/v4";

const headers = {
  "X-Auth-Token": process.env.FOOTBALL_API_KEY!,
};

// ✅ Premier League standings
export async function getStandings() {
  const res = await fetch(`${BASE_URL}/competitions/PL/standings`, {
    headers,
    cache: "no-store",
  });

  return res.json();
}

// ✅ All matches (used for live + next)
export async function getMatches() {
  const res = await fetch(`${BASE_URL}/teams/57/matches`, {
    headers,
    cache: "no-store",
  });

  return res.json();
}

// ✅ 🔥 THIS FIXES YOUR ERROR
export async function getLiveScores() {
  const data = await getMatches();

  return data.matches?.filter(
    (match: any) => match.status === "LIVE"
  ) || [];
}

// ✅ 🔥 THIS FIXES YOUR ERROR
export async function getArsenalNextMatch() {
  const data = await getMatches();

  const upcoming = data.matches?.filter(
    (match: any) => match.status === "SCHEDULED"
  );

  return upcoming?.[0] || null;
}