import type { MatchAnalysisResponse } from "@/lib/football/services/matchAnalysisService";

import MatchCentreSection from "./MatchCentreSection";

interface Props {
  data: MatchAnalysisResponse;
}

export default function MatchCentreContent({
  data,
}: Props) {
  return (
    <div className="space-y-6">

      <MatchCentreSection title="Match Summary">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

      <MatchCentreSection title="Statistics">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

      <MatchCentreSection title="Momentum">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

      <MatchCentreSection title="Tactical Insights">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

      <MatchCentreSection title="Formation Changes">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

      <MatchCentreSection title="Player Rankings">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

      <MatchCentreSection title="Player Awards">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

      <MatchCentreSection title="Editorial Analysis">
        <p className="text-gray-500">
          Coming soon...
        </p>
      </MatchCentreSection>

    </div>
  );
}