import ProgressBar from "./ProgressBar";

interface StatBarProps {
  label: string;

  homeValue: number | string;
  awayValue: number | string;

  homePercentage?: number;
  awayPercentage?: number;

  format?: "number" | "percent" | "decimal";

  className?: string;
}

export default function StatBar({
  label,

  homeValue,
  awayValue,

  homePercentage,
  awayPercentage,

  className = "",
}: StatBarProps) {
  const home =
    homePercentage ??
    Number(homeValue);

  const away =
    awayPercentage ??
    Number(awayValue);

  const total =
    home + away;

  const homeProgress =
    total > 0
      ? (home / total) * 100
      : 50;

  const awayProgress =
    total > 0
      ? (away / total) * 100
      : 50;

  return (
    <div
      className={`space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">

        <span className="text-lg font-bold text-gray-900">
          {homeValue}
        </span>

        <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </span>

        <span className="text-lg font-bold text-gray-900">
          {awayValue}
        </span>

      </div>

      <div className="flex items-center gap-3">

        <div className="flex-1">
          <ProgressBar
            value={homeProgress}
            color="red"
            height="sm"
          />
        </div>

        <div className="flex-1 rotate-180">
          <ProgressBar
            value={awayProgress}
            color="gray"
            height="sm"
          />
        </div>

      </div>
    </div>
  );
}