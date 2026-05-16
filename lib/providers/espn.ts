const BASE_URL =
  process.env.SPORTS_API_URL!;

const API_KEY =
  process.env.SPORTS_API_KEY;

/**
 * GENERIC ESPN FETCHER
 */
async function fetchESPN(
  endpoint: string
) {
  try {
    const res = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        headers: API_KEY
          ? {
              Authorization: API_KEY,
            }
          : {},

        next: {
          revalidate: 60,
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        `ESPN Error: ${res.status}`
      );
    }

    return res.json();
  } catch (error) {
    console.error(
      "ESPN Provider Error:",
      error
    );

    return null;
  }
}

/**
 * LIVE MATCHES
 */
export async function getESPNLiveMatches() {
  const data = await fetchESPN(
    "/eng.1/scoreboard"
  );

  return data?.events || [];
}

/**
 * EPL STANDINGS
 */
export async function getESPNStandings() {
  const data = await fetchESPN(
    "/eng.1/standings"
  );

  return (
    data?.children?.[0]?.standings
      ?.entries || []
  );
}

/**
 * UCL MATCHES
 */
export async function getESPNUCLMatches() {
  const data = await fetchESPN(
    "/uefa.champions/scoreboard"
  );

  return data?.events || [];
}

/**
 * NEXT ARSENAL MATCH
 */
export async function getESPNNextMatch() {
  const data = await fetchESPN(
    "/eng.1/teams/arsenal"
  );

  return data || null;
}