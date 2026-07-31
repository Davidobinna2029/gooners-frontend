import type { MatchIntelligenceDashboardViewModel } from "@/lib/football/mappers/mapMatchIntelligenceDashboard";

interface Props {
  dashboard: MatchIntelligenceDashboardViewModel;
}

interface MetricRowProps {
  label: string;
  home: string | number;
  away: string | number;
}

function MetricRow({
  label,
  home,
  away,
}: MetricRowProps) {
  return (
    <div className="space-y-2">

      <div className="grid grid-cols-3 items-center text-sm">

        <span className="font-medium text-gray-500">
          {label}
        </span>

        <span className="text-center font-semibold text-red-600">
          {home}
        </span>

        <span className="text-center font-semibold text-blue-600">
          {away}
        </span>

      </div>

    </div>
  );
}

export default function MatchIntelligenceCard({
  dashboard,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-lg font-bold text-gray-900">
        Match Intelligence
      </h2>

      <div className="mb-4 grid grid-cols-3 text-xs font-semibold uppercase tracking-wide text-gray-400">

        <span>Metric</span>

        <span className="text-center">
          Home
        </span>

        <span className="text-center">
          Away
        </span>

      </div>

      <div className="space-y-5">

        <MetricRow
          label="Control Index"
          home={dashboard.controlIndex.home.toFixed(1)}
          away={dashboard.controlIndex.away.toFixed(1)}
        />

        <MetricRow
          label="Possession"
          home={`${dashboard.possession.home.toFixed(1)}%`}
          away={`${dashboard.possession.away.toFixed(1)}%`}
        />

        <MetricRow
          label="Field Tilt"
          home={`${dashboard.fieldTilt.home.toFixed(1)}%`}
          away={`${dashboard.fieldTilt.away.toFixed(1)}%`}
        />

        <MetricRow
          label="Dangerous Attacks"
          home={dashboard.dangerousAttacks.home}
          away={dashboard.dangerousAttacks.away}
        />

        <MetricRow
          label="Progressive Passes"
          home={dashboard.progressivePasses.home}
          away={dashboard.progressivePasses.away}
        />

        <MetricRow
          label="PPDA"
          home={dashboard.PPDA.home.toFixed(1)}
          away={dashboard.PPDA.away.toFixed(1)}
        />

      </div>

    </div>
  );
}