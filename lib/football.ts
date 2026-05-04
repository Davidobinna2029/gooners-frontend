export async function getStandings() {
  const res = await fetch(
    "https://api.football-data.org/v4/competitions/PL/standings",
    {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_KEY!,
      },
      cache: "no-store",
    }
  );

  return res.json();
}

export async function getMatches() {
  const res = await fetch(
    "https://api.football-data.org/v4/teams/57/matches?status=SCHEDULED",
    {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_KEY!,
      },
      cache: "no-store",
    }
  );

  return res.json();
}