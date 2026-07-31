import type { MatchStatisticsViewModel } from "@/lib/football/mappers/mapMatchStatistics";

import StatComparisonRow from "./StatComparisonRow";

interface Props {
  stats: MatchStatisticsViewModel;
}

export default function MatchStatisticsCard({
  stats,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-lg font-bold text-gray-900">
        Match Statistics
      </h2>

      <div className="space-y-6">

        <StatComparisonRow
          label="Possession"
          homeValue={stats.possession.home}
          awayValue={stats.possession.away}
          format="percent"
          homePercentage={stats.possession.home}
          awayPercentage={stats.possession.away}
        />

        <StatComparisonRow
          label="Shots"
          homeValue={stats.shots.home}
          awayValue={stats.shots.away}
        />

        <StatComparisonRow
          label="Shots on Target"
          homeValue={stats.shotsOnTarget.home}
          awayValue={stats.shotsOnTarget.away}
        />

        <StatComparisonRow
          label="Expected Goals (xG)"
          homeValue={stats.xG.home}
          awayValue={stats.xG.away}
          format="decimal"
        />

        <StatComparisonRow
          label="Pass Accuracy"
          homeValue={stats.passAccuracy.home}
          awayValue={stats.passAccuracy.away}
          format="percent"
          homePercentage={stats.passAccuracy.home}
          awayPercentage={stats.passAccuracy.away}
        />

        <StatComparisonRow
          label="Progressive Passes"
          homeValue={stats.progressivePasses.home}
          awayValue={stats.progressivePasses.away}
        />

        <StatComparisonRow
          label="Dangerous Attacks"
          homeValue={stats.dangerousAttacks.home}
          awayValue={stats.dangerousAttacks.away}
        />

        <StatComparisonRow
          label="Field Tilt"
          homeValue={stats.fieldTilt.home}
          awayValue={stats.fieldTilt.away}
          format="percent"
          homePercentage={stats.fieldTilt.home}
          awayPercentage={stats.fieldTilt.away}
        />

        <StatComparisonRow
          label="Control Index"
          homeValue={stats.controlIndex.home}
          awayValue={stats.controlIndex.away}
          format="decimal"
        />

        <StatComparisonRow
          label="Tempo Index"
          homeValue={stats.tempoIndex.home}
          awayValue={stats.tempoIndex.away}
          format="decimal"
        />

        <StatComparisonRow
          label="PPDA"
          homeValue={stats.PPDA.home}
          awayValue={stats.PPDA.away}
          format="decimal"
        />

      </div>

    </div>
  );
}