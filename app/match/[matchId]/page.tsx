import { notFound } from "next/navigation";

import MatchCentreLayout from "@/components/football/match-centre/MatchCentreLayout";

import { getMatchAnalysis } from "@/lib/football/services/matchAnalysisService";

import { buildTacticalInsights } from "@/lib/football/intelligence/tacticalInsightsEngine";

import { mapMomentum } from "@/lib/football/mappers/mapMomentum";
import { mapFormation } from "@/lib/football/mappers/mapFormation";
import { mapPlayerRatings } from "@/lib/football/mappers/mapPlayerRatings";
import { mapPlayerAwards } from "@/lib/football/mappers/mapPlayerAwards";
import { mapMatchFacts } from "@/lib/football/mappers/mapMatchFacts";
import { mapMatchStatistics } from "@/lib/football/mappers/mapMatchStatistics";
import { mapMatchReport } from "@/lib/football/mappers/mapMatchReport";
import { mapMatchIntelligenceDashboard } from "@/lib/football/mappers/mapMatchIntelligenceDashboard";

interface Props {
  params: Promise<{
    matchId: string;
  }>;
}

export default async function MatchPage({
  params,
}: Props) {
  const { matchId } = await params;

  try {
    const analysis =
      await getMatchAnalysis(matchId);

    /**
     * Flat tactical insights used by the
     * Match Intelligence Dashboard.
     */
    const dashboardInsights =
      buildTacticalInsights(
        analysis.intelligence
      );

    /**
     * Player rankings.
     */
    const playerRatings =
      mapPlayerRatings(
        analysis.playerRankings
      );

    /**
     * Player awards are derived from rankings.
     */
    const playerAwards =
      mapPlayerAwards(
        playerRatings
      );

    return (
      <MatchCentreLayout
        match={analysis.match}

        facts={
          mapMatchFacts(
            analysis.intelligence
          )
        }

        statistics={
          mapMatchStatistics(
            analysis.intelligence
          )
        }

        momentum={
          mapMomentum(
            analysis.momentum
          )
        }

        formations={
          mapFormation(
            analysis.formationShifts
          )
        }

        playerRatings={
          playerRatings
        }

        playerAwards={
          playerAwards
        }

        /**
         * Editorial report still uses the
         * structured tactical insight model.
         */
        report={
          mapMatchReport(
            analysis.tacticalInsights
          )
        }

        /**
         * Dashboard uses the flat
         * Tactical Insights Engine.
         */
        dashboard={
          mapMatchIntelligenceDashboard(
            analysis.intelligence,
            dashboardInsights
          )
        }
      />
    );
  } catch (error) {
    console.error(
      "[MatchPage]",
      error
    );

    notFound();
  }
}