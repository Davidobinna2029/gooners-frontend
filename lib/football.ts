const ESPN_API =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard";

/* =========================================
   FETCH ESPN
========================================= */
async function fetchESPN() {
  try {
    const response = await fetch(
      ESPN_API,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `ESPN API Error: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error(
      "ESPN Fetch Error:",
      error
    );

    return null;
  }
}

/* =========================================
   LIVE SCORES
========================================= */
export async function getLiveScores() {
  const data = await fetchESPN();

  if (!data?.events) {
    return [];
  }

  return data.events
    .slice(0, 6)
    .map((match: any) => {
      const competition =
        match.competitions?.[0];

      const competitors =
        competition?.competitors || [];

      const home =
        competitors.find(
          (team: any) =>
            team.homeAway === "home"
        );

      const away =
        competitors.find(
          (team: any) =>
            team.homeAway === "away"
        );

      return {
        id: match.id,

        status:
          competition?.status?.type
            ?.description || "LIVE",

        homeTeam:
          home?.team?.shortDisplayName ||
          "Home",

        awayTeam:
          away?.team?.shortDisplayName ||
          "Away",

        homeScore:
          home?.score || "0",

        awayScore:
          away?.score || "0",
      };
    });
}

/* =========================================
   NEXT MATCH
========================================= */
export async function getNextMatch() {
  const data = await fetchESPN();

  if (!data?.events) {
    return null;
  }

  const arsenalMatch =
    data.events.find((match: any) => {
      const competitors =
        match.competitions?.[0]
          ?.competitors || [];

      return competitors.some(
        (team: any) =>
          team.team?.displayName ===
          "Arsenal"
      );
    });

  if (!arsenalMatch) {
    return null;
  }

  const competition =
    arsenalMatch.competitions?.[0];

  const competitors =
    competition?.competitors || [];

  const home =
    competitors.find(
      (team: any) =>
        team.homeAway === "home"
    );

  const away =
    competitors.find(
      (team: any) =>
        team.homeAway === "away"
    );

  return {
    id: arsenalMatch.id,

    date: arsenalMatch.date,

    venue:
      competition?.venue?.fullName ||
      "Unknown Venue",

    homeTeam:
      home?.team?.displayName ||
      "Home",

    awayTeam:
      away?.team?.displayName ||
      "Away",
  };
}

/* =========================================
   EPL STANDINGS
========================================= */
export async function getStandings() {
  try {
    const response = await fetch(
      "https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings",
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Standings API Error: ${response.status}`
      );
    }

    const data =
      await response.json();

    const standings =
      data?.children?.[0]
        ?.standings?.entries || [];

    return standings
      .slice(0, 10)
      .map((team: any) => ({
        position:
          team.stats?.find(
            (s: any) =>
              s.name === "rank"
          )?.value || "-",

        team:
          team.team?.shortDisplayName,

        points:
          team.stats?.find(
            (s: any) =>
              s.name === "points"
          )?.value || 0,
      }));
  } catch (error) {
    console.error(
      "Standings Fetch Error:",
      error
    );

    return [];
  }
}