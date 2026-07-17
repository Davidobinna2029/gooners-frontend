// src/design-system/football/FootballStatBar.tsx

interface FootballStatBarProps {
  label: string;

  home: number;

  away: number;

  homeDisplay?: string;

  awayDisplay?: string;
}

export default function FootballStatBar({
  label,
  home,
  away,
  homeDisplay,
  awayDisplay,
}: FootballStatBarProps) {
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
      <div className="flex items-center justify-between text-sm font-medium">
        <span>
          {homeDisplay ?? home}
        </span>

        <span className="text-gray-500">
          {label}
        </span>

        <span>
          {awayDisplay ?? away}
        </span>
      </div>

      <div className="flex h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="bg-red-600 transition-all"
          style={{
            width: `${homePercent}%`,
          }}
        />

        <div
          className="bg-gray-700 transition-all"
          style={{
            width: `${awayPercent}%`,
          }}
        />
      </div>
    </div>
  );
}