import type { MatchAnalysisResponse } from "@/lib/football/services/matchAnalysisService";

import MatchCentreHeader from "./MatchCentreHeader";
import MatchCentreTabs from "./MatchCentreTabs";
import MatchCentreContent from "./MatchCentreContent";
import MatchCentreSidebar from "./MatchCentreSidebar";

interface Props {
  data: MatchAnalysisResponse;
}

export default function MatchCentreLayout({
  data,
}: Props) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">

      <MatchCentreHeader
        match={data.match}
      />

      <div className="mt-6">
        <MatchCentreTabs />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">

        <div className="lg:col-span-8">

          <MatchCentreContent
            data={data}
          />

        </div>

        <aside className="lg:col-span-4">

          <MatchCentreSidebar
            data={data}
          />

        </aside>

      </div>

    </main>
  );
}