import type { ReactNode } from "react";

interface MetricTileProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accent?: "neutral" | "primary" | "success" | "warning";
  className?: string;
}

export default function MetricTile({
  label,
  value,
  subtitle,
  icon,
  accent = "neutral",
  className = "",
}: MetricTileProps) {
  const accents = {
    neutral: "border-gray-200",
    primary: "border-red-200",
    success: "border-green-200",
    warning: "border-yellow-200",
  };

  return (
    <div
      className={`
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-md
        ${accents[accent]}
        ${className}
      `}
    >
      <div className="flex items-center justify-between">

        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          {label}
        </p>

        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}

      </div>

      <div className="mt-3">

        <p className="text-3xl font-extrabold tracking-tight text-gray-900">
          {value}
        </p>

        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        )}

      </div>

    </div>
  );
}