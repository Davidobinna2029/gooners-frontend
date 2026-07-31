import type { MatchViewModel } from "@/lib/football/models/matchViewModel";

import type { MatchFactsViewModel } from "@/lib/football/mappers/mapMatchFacts";
import type { MatchStatisticsViewModel } from "@/lib/football/mappers/mapMatchStatistics";
import type { MomentumViewModel } from "@/lib/football/mappers/mapMomentum";
import type { FormationViewModel } from "@/lib/football/mappers/mapFormation";
import type { PlayerRatingsViewModel } from "@/lib/football/mappers/mapPlayerRatings";
import type { PlayerAwardViewModel } from "@/lib/football/mappers/mapPlayerAwards";
import type { MatchReportViewModel } from "@/lib/football/mappers/mapMatchReport";
import type { MatchIntelligenceDashboardViewModel } from "@/lib/football/mappers/mapMatchIntelligenceDashboard";

import MatchCentreHeader from "./MatchCentreHeader";
import MatchCentreTabs from "./MatchCentreTabs";
import MatchCentreContent from "./MatchCentreContent";
import MatchCentreSidebar from "./MatchCentreSidebar";

interface Props {
  match: MatchViewModel;

  facts: MatchFactsViewModel;

  statistics: MatchStatisticsViewModel;

  momentum: MomentumViewModel;

  formations: FormationViewModel;

  playerRatings: PlayerRatingsViewModel;

  playerAwards: PlayerAwardViewModel[];

  report: MatchReportViewModel;

  dashboard: MatchIntelligenceDashboardViewModel;
}

export default function MatchCentreLayout({
  match,
  facts,
  statistics,
  momentum,
  formations,
  playerRatings,
  playerAwards,
  report,
  dashboard,
}: Props) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <MatchCentreHeader match={match} />

      <div className="mt-6">
        <MatchCentreTabs />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <MatchCentreContent
            match={match}
            facts={facts}
            statistics={statistics}
            momentum={momentum}
            formations={formations}
            playerRatings={playerRatings}
            playerAwards={playerAwards}
            report={report}
            dashboard={dashboard}
          />
        </div>

        <aside className="lg:col-span-4">
          <MatchCentreSidebar
            playerRatings={playerRatings}
            dashboard={dashboard}
          />
        </aside>
      </div>
    </main>
  );
}