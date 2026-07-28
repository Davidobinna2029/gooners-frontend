import type { MatchAnalysisResponse } from "@/lib/football/services/matchAnalysisService";

import MatchCentreSection from "./MatchCentreSection";

interface Props {
  data: MatchAnalysisResponse;
}

export default function MatchCentreSidebar({
  data,
}: Props) {
  return (
    <div className="space-y-6">

      <MatchCentreSection title="Next Match">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

      <MatchCentreSection title="League Table">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

      <MatchCentreSection title="Related News">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

      <MatchCentreSection title="Match Facts">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

    </div>
  );
}