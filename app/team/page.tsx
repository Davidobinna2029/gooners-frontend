// app/team/page.tsx

import { fetchTeamOverview } from "@/lib/football/repositories/teamRepository";

import TeamHub from "@/components/team/TeamHub";

export const dynamic = "force-dynamic";

export const revalidate = 0;

/**
 * Arsenal FC
 *
 * Football-Data.org Team ID
 */
const TEAM_ID = 57;

export default async function TeamPage() {
  const overview =
    await fetchTeamOverview(TEAM_ID);

  return (
    <main className="team-page">

      <div className="container">

        <TeamHub
          overview={overview}
        />

      </div>

    </main>
  );
}