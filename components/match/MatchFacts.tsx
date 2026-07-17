// components/match/MatchFacts.tsx

import type { Match } from "@/lib/football/types/match";
import type { HeadToHeadMatch } from "@/lib/football/advancedProvider";

import {
  FootballCard,
  FootballSection,
} from "@/src/design-system";

import EmptyState from "@/src/design-system/ui/EmptyState";

interface Props {
  match: Match;
  headToHead: HeadToHeadMatch[];
}

export default function MatchFacts({
  match,
  headToHead,
}: Props) {
  return (
    <FootballSection title="Match Facts">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Match Information */}

        <FootballCard>
          <h4 className="mb-4 text-lg font-semibold">
            Match Information
          </h4>

          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Competition
              </dt>

              <dd className="text-base font-semibold text-gray-900">
                {match.competition.name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Status
              </dt>

              <dd className="text-base font-semibold text-gray-900">
                {match.status}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Kickoff
              </dt>

              <dd className="text-base font-semibold text-gray-900">
                {new Date(match.kickoff).toLocaleString()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Venue
              </dt>

              <dd className="text-base font-semibold text-gray-900">
                {match.venue ?? "TBC"}
              </dd>
            </div>
          </dl>
        </FootballCard>

        {/* Head-to-Head */}

        <FootballCard>
          <h4 className="mb-4 text-lg font-semibold">
            Previous Meetings
          </h4>

          {!headToHead.length ? (
            <EmptyState
              title="No Previous Meetings"
              description="No historical fixtures are available."
            />
          ) : (
            <div className="space-y-4">
              {headToHead.map((game) => (
                <div
                  key={game.id}
                  className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>{game.homeTeam}</span>

                    <span>
                      {game.homeScore} - {game.awayScore}
                    </span>

                    <span>{game.awayTeam}</span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {game.competition} •{" "}
                    {new Date(game.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </FootballCard>
      </div>
    </FootballSection>
  );
}