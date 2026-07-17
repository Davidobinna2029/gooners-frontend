// src/design-system/football/FootballScore.tsx

interface FootballScoreProps {
  home: number | null;
  away: number | null;
  live?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function FootballScore({
  home,
  away,
  live = false,
  size = "md",
}: FootballScoreProps) {
  const sizes = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <span
        className={`font-bold ${sizes[size]}`}
      >
        {home ?? "-"}
      </span>

      <span
        className={`${sizes[size]} text-gray-400`}
      >
        -
      </span>

      <span
        className={`font-bold ${sizes[size]}`}
      >
        {away ?? "-"}
      </span>

      {live && (
        <span className="ml-2 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white">
          LIVE
        </span>
      )}
    </div>
  );
}