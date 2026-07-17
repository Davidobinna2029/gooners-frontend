// src/design-system/football/pitch/FootballPlayerBadge.tsx

import type { PlayerStatus } from "./playerStatus";

interface Props {
  status?: PlayerStatus;
}

const badgeMap: Record<
  Exclude<PlayerStatus, "normal">,
  {
    label: string;
    className: string;
  }
> = {
  captain: {
    label: "C",
    className:
      "bg-yellow-500 text-black",
  },

  goal: {
    label: "⚽",
    className:
      "bg-green-600 text-white",
  },

  yellow: {
    label: "🟨",
    className:
      "bg-yellow-400 text-black",
  },

  red: {
    label: "🟥",
    className:
      "bg-red-600 text-white",
  },

  subbed: {
    label: "⇄",
    className:
      "bg-blue-600 text-white",
  },

  injured: {
    label: "🤕",
    className:
      "bg-orange-500 text-white",
  },

  mvp: {
    label: "★",
    className:
      "bg-purple-600 text-white",
  },
};

export default function FootballPlayerBadge({
  status = "normal",
}: Props) {
  if (status === "normal") {
    return null;
  }

  const badge = badgeMap[status];

  return (
    <div
      className={`
        absolute
        -right-1
        -top-1
        flex
        h-5
        w-5
        items-center
        justify-center
        rounded-full
        text-[10px]
        font-bold
        shadow-md
        ${badge.className}
      `}
    >
      {badge.label}
    </div>
  );
}