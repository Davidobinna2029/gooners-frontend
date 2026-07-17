// src/design-system/football/pitch/FootballGoal.tsx

interface FootballGoalProps {
  side: "top" | "bottom";
}

export default function FootballGoal({
  side,
}: FootballGoalProps) {
  const position =
    side === "top"
      ? "top-2"
      : "bottom-2";

  const border =
    side === "top"
      ? "border-t-0"
      : "border-b-0";

  return (
    <div
      className={`
        absolute
        left-1/2
        h-4
        w-20
        -translate-x-1/2
        rounded-sm
        border-2
        border-white/80
        ${position}
        ${border}
      `}
    />
  );
}