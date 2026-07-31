import clsx from "clsx";

interface Props {
  label: string;

  homeValue: number | string;

  awayValue: number | string;

  homePercentage?: number;

  awayPercentage?: number;

  format?: "number" | "percent" | "decimal";
}

function formatValue(
  value: number | string,
  format: Props["format"]
) {
  if (typeof value === "string") {
    return value;
  }

  switch (format) {
    case "percent":
      return `${value.toFixed(1)}%`;

    case "decimal":
      return value.toFixed(2);

    default:
      return value.toLocaleString();
  }
}

export default function StatComparisonRow({
  label,
  homeValue,
  awayValue,
  homePercentage,
  awayPercentage,
  format = "number",
}: Props) {
  const left =
    homePercentage ??
    (typeof homeValue === "number"
      ? homeValue
      : 0);

  const right =
    awayPercentage ??
    (typeof awayValue === "number"
      ? awayValue
      : 0);

  const total =
    left + right;

  const homeWidth =
    total === 0
      ? 50
      : (left / total) * 100;

  const awayWidth =
    total === 0
      ? 50
      : (right / total) * 100;

  const homeLeading =
    left > right;

  const awayLeading =
    right > left;

  return (
    <div className="space-y-2">

      <div className="flex items-center justify-between">

        <span
          className={clsx(
            "font-semibold",
            homeLeading
              ? "text-red-600"
              : "text-gray-700"
          )}
        >
          {formatValue(
            homeValue,
            format
          )}
        </span>

        <span className="text-sm font-medium text-gray-500">
          {label}
        </span>

        <span
          className={clsx(
            "font-semibold",
            awayLeading
              ? "text-blue-600"
              : "text-gray-700"
          )}
        >
          {formatValue(
            awayValue,
            format
          )}
        </span>

      </div>

      <div className="flex h-3 overflow-hidden rounded-full bg-gray-200">

        <div
          className="bg-red-600 transition-all duration-500"
          style={{
            width: `${homeWidth}%`,
          }}
        />

        <div
          className="bg-blue-600 transition-all duration-500"
          style={{
            width: `${awayWidth}%`,
          }}
        />

      </div>

    </div>
  );
}