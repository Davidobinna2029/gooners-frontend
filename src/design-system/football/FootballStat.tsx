// src/design-system/football/FootballStat.tsx

import type { ReactNode } from "react";

interface FootballStatProps {
  label: string;

  value?: ReactNode;

  homeValue?: ReactNode;

  awayValue?: ReactNode;

  subValue?: ReactNode;

  className?: string;
}

export default function FootballStat({
  label,
  value,
  homeValue,
  awayValue,
  subValue,
  className = "",
}: FootballStatProps) {
  const isComparison =
    homeValue !== undefined &&
    awayValue !== undefined;

  return (
    <div
      className={`
        rounded-xl
        border
        border-gray-200
        bg-white
        p-4
        ${className}
      `}
    >
      {isComparison ? (
        <>
          <div className="grid grid-cols-3 items-center">
            <div className="text-left text-2xl font-bold text-gray-900">
              {homeValue}
            </div>

            <div className="text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
              {label}
            </div>

            <div className="text-right text-2xl font-bold text-gray-900">
              {awayValue}
            </div>
          </div>

          {subValue && (
            <div className="mt-2 text-center text-sm text-gray-500">
              {subValue}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {label}
          </div>

          <div className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </div>

          {subValue && (
            <div className="mt-1 text-sm text-gray-500">
              {subValue}
            </div>
          )}
        </>
      )}
    </div>
  );
}