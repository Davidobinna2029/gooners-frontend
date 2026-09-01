interface Props {
  label: string;
  home: number;
  away: number;
  suffix?: string;
}

export default function StatisticComparisonRow({
  label,
  home,
  away,
  suffix = "",
}: Props) {
  const total = home + away;

  const homePercent =
    total === 0
      ? 50
      : (home / total) * 100;

  const awayPercent =
    total === 0
      ? 50
      : (away / total) * 100;

  return (
    <div className="space-y-2">

      <div className="flex items-center justify-between">

        <span className="text-lg font-bold text-red-600">
          {home}
          {suffix}
        </span>

        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </span>

        <span className="text-lg font-bold text-blue-600">
          {away}
          {suffix}
        </span>

      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">

        <div className="h-3 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full rounded-full bg-red-500 transition-all duration-700 ease-out"
            style={{
              width: `${homePercent}%`,
            }}
          />

        </div>

        <div className="text-xs font-medium text-gray-400">
          VS
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-200">

          <div
            className="ml-auto h-full rounded-full bg-blue-500 transition-all duration-700 ease-out"
            style={{
              width: `${awayPercent}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}