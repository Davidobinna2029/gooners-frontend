// app/match/[id]/analysis/page.tsx

import MatchHeader from "@/components/analysis/MatchHeader";
import MatchAnalysisCard from "@/components/analysis/MatchAnalysisCard";
import TacticalInsightsCard from "@/components/analysis/TacticalInsightsCard";
import MomentumTimeline from "@/components/analysis/MomentumTimeline";
import FormationCard from "@/components/analysis/FormationCard";
import MatchIntelligenceGrid from "@/components/analysis/MatchIntelligenceGrid";
import AnalysisFooter from "@/components/analysis/AnalysisFooter";

import {
  getMatchAnalysis,
} from "@/lib/football/services/matchAnalysisService";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function MatchAnalysisPage({
  params,
}: Props) {
  const { id } = await params;

  const analysis = await getMatchAnalysis(id);

  return (
    <main>
      <MatchHeader match={analysis.match} />

      <MatchAnalysisCard
        analysis={analysis.report}
      />

      <TacticalInsightsCard
        insights={analysis.tacticalInsights}
      />

      <MomentumTimeline
        momentum={analysis.momentum}
      />

      <FormationCard
        formations={analysis.formationShifts}
      />

      <MatchIntelligenceGrid
        intelligence={analysis.intelligence}
      />

      <AnalysisFooter />
    </main>
  );
}