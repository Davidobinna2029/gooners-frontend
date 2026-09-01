import type { MatchViewModel } from "@/lib/football/models/matchViewModel";

import type { MatchFactsViewModel } from "@/lib/football/mappers/mapMatchFacts";
import type { MatchStatisticsViewModel } from "@/lib/football/mappers/mapMatchStatistics";
import type { MomentumViewModel } from "@/lib/football/mappers/mapMomentum";
import type { FormationViewModel } from "@/lib/football/mappers/mapFormation";
import type { PlayerRatingsViewModel } from "@/lib/football/mappers/mapPlayerRatings";
import type { PlayerAwardViewModel } from "@/lib/football/mappers/mapPlayerAwards";
import type { MatchReportViewModel } from "@/lib/football/mappers/mapMatchReport";
import type { MatchIntelligenceDashboardViewModel } from "@/lib/football/mappers/mapMatchIntelligenceDashboard";

import MatchCentreSection from "./MatchCentreSection";

import MatchSummaryCard from "./cards/MatchSummaryCard";
import MatchStatisticsCard from "./cards/MatchStatisticsCard";
import MatchIntelligenceCard from "./cards/MatchIntelligenceCard";
import MomentumTimelineCard from "./cards/MomentumTimelineCard";
import TacticalInsightsCard from "./cards/TacticalInsightsCard";
import FormationChangesCard from "./cards/FormationChangesCard";
import PlayerRankingsCard from "./cards/PlayerRankingsCard";
import PlayerAwardsCard from "./cards/PlayerAwardsCard";

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

export default function MatchCentreContent({
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
    <div className="space-y-6">

      <MatchCentreSection title="Match Summary">
        <MatchSummaryCard
          facts={facts}
        />
      </MatchCentreSection>

      <MatchCentreSection title="Match Intelligence">
        <MatchIntelligenceCard
          dashboard={dashboard}
        />
      </MatchCentreSection>

      <MatchCentreSection title="Statistics">
        <MatchStatisticsCard
          stats={statistics}
        />
      </MatchCentreSection>

      <MatchCentreSection title="Momentum">
        <MomentumTimelineCard
          momentum={momentum}
        />
      </MatchCentreSection>

      <MatchCentreSection title="Tactical Insights">
        <TacticalInsightsCard
          report={report}
        />
      </MatchCentreSection>

      <MatchCentreSection title="Formation Changes">
        <FormationChangesCard
          formation={formations}
        />
      </MatchCentreSection>

      <MatchCentreSection title="Player Rankings">
        <PlayerRankingsCard
          ratings={playerRatings}
        />
      </MatchCentreSection>

      <MatchCentreSection title="Player Awards">
        <PlayerAwardsCard
          awards={playerAwards}
        />
      </MatchCentreSection>

      <MatchCentreSection title="Editorial Analysis">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

    </div>
  );
}