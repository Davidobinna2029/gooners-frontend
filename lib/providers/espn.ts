const BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

export async function getLiveScores() {
  try {
    const response =
      await fetch(
        `${BASE_URL}/eng.1/scoreboard`,
        {
          next: {
            revalidate: 60,
          },
        }
      );

    if (!response.ok) {
      return [];
    }

    const data =
      await response.json();

    return data.events || [];
  } catch (error) {
    console.error(
      "ESPN Scores Error:",
      error
    );

    return [];
  }
}

export async function getStandings() {
  try {
    const response =
      await fetch(
        `${BASE_URL}/eng.1/standings`,
        {
          next: {
            revalidate: 300,
          },
        }
      );

    if (!response.ok) {
      return [];
    }

    const data =
      await response.json();

    return (
      data?.children?.[0]
        ?.standings?.entries || []
    );
  } catch (error) {
    console.error(
      "ESPN Standings Error:",
      error
    );

    return [];
  }
}

export async function getFixtures() {
  try {
    const response =
      await fetch(
        `${BASE_URL}/eng.1/schedule`,
        {
          next: {
            revalidate: 300,
          },
        }
      );

    if (!response.ok) {
      return [];
    }

    const data =
      await response.json();

    return data.events || [];
  } catch (error) {
    console.error(
      "ESPN Fixtures Error:",
      error
    );

    return [];
  }
}