// components/team/TeamHub.tsx

import type {
  TeamOverview,
} from "@/lib/football/models/footballDashboard";

import TeamHeader from "./TeamHeader";
import TeamForm from "./TeamForm";
import TeamNextMatch from "./TeamNextMatch";
import TeamFixtures from "./TeamFixtures";
import TeamResults from "./TeamResults";
import TeamStandings from "./TeamStandings";
import TeamSquad from "./TeamSquad";
import TeamInjuries from "./TeamInjuries";

interface Props {
  overview: TeamOverview;
}

export default function TeamHub({
  overview,
}: Props) {
  return (
    <main className="container mx-auto space-y-8 py-8">

      <TeamHeader
        team={overview.team}
      />

      <TeamForm
        standings={overview.standings}
      />

      <TeamNextMatch
        fixtures={overview.fixtures}
      />

      <TeamFixtures
        fixtures={overview.fixtures}
      />

      <TeamResults
        results={overview.results}
      />

      <TeamStandings
        standings={overview.standings}
      />

      <TeamSquad
        players={overview.players}
      />

      <TeamInjuries
        injuries={overview.injuries}
      />

    </main>
  );
}