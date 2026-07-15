// components/match/MatchHeader.tsx

import type { Match } from "@/lib/football/types/match";

import LiveBadge from "@/components/sports/LiveBadge";

interface Props {
  match: Match;
}

export default function MatchHeader({
  match,
}: Props) {
  return (
    <header className="match-header">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {match.competition.name}
          </p>

          <h1 className="text-2xl font-bold">
            {match.homeTeam.name}
            {" vs "}
            {match.awayTeam.name}
          </h1>

          <p className="text-sm text-gray-500">
            {match.venue ?? "Venue TBC"}
          </p>

        </div>

        <LiveBadge match={match} />

      </div>

    </header>
  );
}