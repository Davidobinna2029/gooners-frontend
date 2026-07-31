import type { PlayerRatingsViewModel } from "@/lib/football/mappers/mapPlayerRatings";
import type { MatchIntelligenceDashboardViewModel } from "@/lib/football/mappers/mapMatchIntelligenceDashboard";

import MatchCentreSection from "./MatchCentreSection";

interface Props {
  playerRatings: PlayerRatingsViewModel;
  dashboard: MatchIntelligenceDashboardViewModel;
}

export default function MatchCentreSidebar({
  playerRatings,
  dashboard,
}: Props) {
  return (
    <div className="space-y-6">

      <MatchCentreSection title="Player Ratings">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

      <MatchCentreSection title="Match Intelligence">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

    </div>
  );
}