interface Props {
  label: string;
  value: number;
  color?: "home" | "away";
}

export default function MomentumBar({
  label,
  value,
  color = "home",
}: Props) {
  const percentage = Math.max(
    0,
    Math.min(value, 100)
  );

  const barColor =
    color === "home"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <div className="space-y-2">

      <div className="flex items-center justify-between">

        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>

        <span className="text-sm font-semibold text-gray-900">
          {percentage.toFixed(0)}%
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-200">

        <div
          className={`${barColor} h-full rounded-full transition-all duration-700 ease-out`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}