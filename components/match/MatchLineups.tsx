// components/match/MatchLineups.tsx

import type { Match } from "@/lib/football/types/match";
import type {
  TeamLineup,
} from "@/lib/football/advancedProvider";

interface Props {
  match: Match;
  lineups: TeamLineup[];
}

export default function MatchLineups({
  match,
  lineups,
}: Props) {
  if (!lineups.length) {
    return (
      <section className="match-lineups">
        <h3>Lineups</h3>

        <p>
          Lineups have not been announced.
        </p>
      </section>
    );
  }

  return (
    <section className="match-lineups">

      <h3>
        Lineups
      </h3>

      <div className="lineups-grid">

        {lineups.map((team) => (
          <div
            key={team.teamId}
            className="lineup-team"
          >

            <h4>
              {team.teamName}
            </h4>

            <p>
              Formation: {team.formation}
            </p>

            <p>
              Coach: {team.coach}
            </p>

            <h5>
              Starting XI
            </h5>

            <ul>

              {team.startingXI.map((player) => (
                <li key={player.id}>
                  {player.number && (
                    <>#{player.number} </>
                  )}

                  {player.name}

                  {player.position && (
                    <> ({player.position})</>
                  )}

                  {player.captain && (
                    <> (C)</>
                  )}
                </li>
              ))}

            </ul>

            {team.substitutes.length > 0 && (
              <>

                <h5>
                  Substitutes
                </h5>

                <ul>

                  {team.substitutes.map(
                    (player) => (
                      <li
                        key={player.id}
                      >
                        {player.number && (
                          <>#{player.number} </>
                        )}

                        {player.name}

                        {player.position && (
                          <> ({player.position})</>
                        )}
                      </li>
                    )
                  )}

                </ul>

              </>
            )}

          </div>
        ))}

      </div>

    </section>
  );
}