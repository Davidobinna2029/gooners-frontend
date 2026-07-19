// components/match/MatchLineups.tsx

import type {
  FootballLineup,
} from "@/src/lib/football/types";

import {
  FootballCard,
  FootballPlayerRow,
  FootballSection,
} from "@/src/design-system";

import EmptyState from "@/src/design-system/ui/EmptyState";

import MatchFormationPitch from "./MatchFormationPitch";


interface Props {
  lineups: FootballLineup[];
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

      <div className="grid gap-8 lg:grid-cols-2">

        {lineups.map((team) => (

          <FootballCard
            key={team.teamId}
          >

            <div className="space-y-6">


              {/* Team Header */}

              <div className="border-b border-gray-200 pb-4">

                <h3 className="text-xl font-bold text-gray-900">
                  Team #{team.teamId}
                </h3>


                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">

                  <span>
                    <strong>Formation:</strong>{" "}
                    {team.formation}
                  </span>


                  <span>
                    <strong>Coach:</strong>{" "}
                    {team.coach?.name ?? "Unknown"}
                  </span>

                </div>

              </div>



              {/* Formation Pitch */}

              <div>

                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Formation
                </h4>


                <MatchFormationPitch
                  team={team}
                />

              </div>



              {/* Substitutes */}

              {team.substitutes.length > 0 && (

                <div>

                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
                    Substitutes
                  </h4>


                  <div className="space-y-2">

                    {team.substitutes.map(
                      (player) => (

                        <FootballPlayerRow
                          key={player.id}

                          number={
                            player.number
                          }

                          name={
                            player.name
                          }

                          position={
                            player.position
                          }

                          substitute
                        />

                      )
                    )}

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