import type { Match } from "@/lib/football/types/match";

interface Props {
  match: Match;
}

export default function LiveBadge({
  match,
}: Props) {
  const liveStatuses = [
    "LIVE",
    "IN_PLAY",
    "PAUSED",
  ];

  if (!liveStatuses.includes(match.status)) {
    return null;
  }

  return (
    <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
      LIVE
    </span>
  );
}