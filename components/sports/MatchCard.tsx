// components/sports/MatchCard.tsx

import Link from "next/link";

import type { Match } from "@/lib/football/types/match";

import { FootballCard } from "@/src/design-system";

import LiveBadge from "./LiveBadge";
import MatchClock from "./MatchClock";

interface Props {
  match: Match;
}

export default function MatchCard({
  match,
}: Props) {
  return (
    <Link
      href={`/match/${match.id}`}
      className="block"
    >
      <FootballCard className="p-5 transition-shadow hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {match.competition.name}
          </span>

          <LiveBadge match={match} />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Home */}
          <div className="text-center">
            {match.homeTeam.crest && (
              <img
                src={match.homeTeam.crest}
                alt={match.homeTeam.name}
                className="mx-auto mb-2 h-12 w-12 object-contain"
              />
            )}

            <p className="font-semibold">
              {match.homeTeam.name}
            </p>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="text-2xl font-bold">
              {match.score.home}

              <span className="mx-2 text-gray-400">
                -
              </span>

              {match.score.away}
            </div>

            <div className="mt-2 text-sm text-gray-500">
              <MatchClock match={match} />
            </div>
          </div>

          {/* Away */}
          <div className="text-center">
            {match.awayTeam.crest && (
              <img
                src={match.awayTeam.crest}
                alt={match.awayTeam.name}
                className="mx-auto mb-2 h-12 w-12 object-contain"
              />
            )}

            <p className="font-semibold">
              {match.awayTeam.name}
            </p>
          </div>
        </div>
      </FootballCard>
    </Link>
  );
}