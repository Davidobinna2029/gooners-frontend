// components/match/MatchLineups.tsx

import type {
  TeamLineup,
} from "@/lib/football/advancedProvider";

import {
  FootballCard,
  FootballPlayerRow,
  FootballSection,
} from "@/src/design-system";

import EmptyState from "@/src/design-system/ui/EmptyState";

interface Props {
  lineups: TeamLineup[];
}

export default function MatchLineups({
  lineups,
}: Props) {
  if (!lineups.length) {
    return (
      <FootballSection title="Lineups">
        <EmptyState
          title="Lineups Not Available"
          description="The starting lineups have not been announced yet."
        />
      </FootballSection>
    );
  }

  return (
    <FootballSection title="Lineups">
      <div className="grid gap-6 lg:grid-cols-2">
        {lineups.map((team) => (
          <FootballCard key={team.teamId}>
            <div className="space-y-6">
              {/* Team Header */}

              <div>
                <h3 className="text-xl font-bold">
                  {team.teamName}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Formation: {team.formation}
                </p>

                <p className="text-sm text-gray-500">
                  Coach: {team.coach}
                </p>
              </div>

              {/* Starting XI */}

              <div>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Starting XI
                </h4>

                <div className="space-y-2">
                  {team.startingXI.map((player) => (
                    <FootballPlayerRow
                      key={player.id}
                      number={player.number}
                      name={player.name}
                      position={player.position}
                      captain={player.captain}
                      starter
                    />
                  ))}
                </div>
              </div>

              {/* Substitutes */}

              {team.substitutes.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
                    Substitutes
                  </h4>

                  <div className="space-y-2">
                    {team.substitutes.map((player) => (
                      <FootballPlayerRow
                        key={player.id}
                        number={player.number}
                        name={player.name}
                        position={player.position}
                        substitute
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FootballCard>
        ))}
      </div>
    </FootballSection>
  );
}