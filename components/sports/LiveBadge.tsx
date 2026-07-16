// components/sports/LiveBadge.tsx

import type { Match } from "@/lib/football/types/match";

import { FootballBadge } from "@/src/design-system";

interface Props {
  match: Match;
}

const liveStatuses = [
  "LIVE",
  "IN_PLAY",
  "PAUSED",
] as const;

export default function LiveBadge({
  match,
}: Props) {
  if (!liveStatuses.includes(match.status as (typeof liveStatuses)[number])) {
    return null;
  }

  return (
    <FootballBadge
      status="LIVE"
    />
  );
}