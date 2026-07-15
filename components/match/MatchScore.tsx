// components/match/MatchScore.tsx

import type { Match } from "@/lib/football/types/match";

import TeamBadge from "./TeamBadge";

interface MatchScoreProps {
  match: Match;
}

export default function MatchScore({
  match,
}: MatchScoreProps) {
  return (
    <section className="py-6">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">

        {/* Home Team */}
        <div className="flex flex-col items-center text-center">
          <TeamBadge
            logo={match.homeTeam.crest}
            name={match.homeTeam.name}
            size={56}
          />

          <h3 className="mt-3 text-sm font-semibold text-gray-900">
            {match.homeTeam.shortName ??
              match.homeTeam.name}
          </h3>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold tracking-tight">
            {match.score.home}
          </span>

          <span className="text-lg font-medium text-gray-400">
            -
          </span>

          <span className="text-4xl font-bold tracking-tight">
            {match.score.away}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center text-center">
          <TeamBadge
            logo={match.awayTeam.crest}
            name={match.awayTeam.name}
            size={56}
          />

          <h3 className="mt-3 text-sm font-semibold text-gray-900">
            {match.awayTeam.shortName ??
              match.awayTeam.name}
          </h3>
        </div>

      </div>
    </section>
  );
}