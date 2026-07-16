// src/design-system/football/FootballHero.tsx

import type { ReactNode } from "react";

import FootballBadge from "./FootballBadge";

interface FootballHeroProps {
  title: string;
  subtitle?: string;

  home?: ReactNode;
  center?: ReactNode;
  away?: ReactNode;

  status?: string;

  footer?: ReactNode;

  className?: string;
}

export default function FootballHero({
  title,
  subtitle,
  home,
  center,
  away,
  status,
  footer,
  className = "",
}: FootballHeroProps) {
  return (
    <section
      className={`
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
        ${className}
      `}
    >
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-1 text-gray-500">
                {subtitle}
              </p>
            )}
          </div>

          {status && (
            <FootballBadge status={status} />
          )}
        </div>
      </div>

      {(home || center || away) && (
        <div className="grid grid-cols-3 items-center gap-6 px-6 py-8">
          <div className="text-center">
            {home}
          </div>

          <div className="text-center">
            {center}
          </div>

          <div className="text-center">
            {away}
          </div>
        </div>
      )}

      {footer && (
        <div className="border-t border-gray-100 px-6 py-4">
          {footer}
        </div>
      )}
    </section>
  );
}