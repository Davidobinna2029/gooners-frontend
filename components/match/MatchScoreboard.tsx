// components/match/MatchScoreboard.tsx

import type { Match } from "@/lib/football/types/match";

import LiveBadge from "@/components/sports/LiveBadge";
import MatchClock from "@/components/sports/MatchClock";

interface Props {
  match: Match;
}

export default function MatchScoreboard({
  match,
}: Props) {
  return (
    <section className="match-scoreboard rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <LiveBadge match={match} />

        <MatchClock match={match} />
      </div>

      <div className="grid grid-cols-3 items-center text-center">
        {/* Home Team */}

        <div>
          {match.homeTeam.crest && (
            <img
              src={match.homeTeam.crest}
              alt={match.homeTeam.name}
              className="mx-auto mb-3 h-16 w-16 object-contain"
            />
          )}

          <h3 className="font-semibold">
            {match.homeTeam.name}
          </h3>
        </div>

        {/* Score */}

        <div>
          <div className="text-5xl font-bold">
            <span>
              {match.score.home}
            </span>

            <span className="mx-3 text-gray-400">
              -
            </span>

            <span>
              {match.score.away}
            </span>
          </div>
        </div>

        {/* Away Team */}

        <div>
          {match.awayTeam.crest && (
            <img
              src={match.awayTeam.crest}
              alt={match.awayTeam.name}
              className="mx-auto mb-3 h-16 w-16 object-contain"
            />
          )}

          <h3 className="font-semibold">
            {match.awayTeam.name}
          </h3>
        </div>
      </div>
    </section>
  );
}