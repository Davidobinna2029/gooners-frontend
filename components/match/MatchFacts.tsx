// components/match/MatchFacts.tsx

import type { Match } from "@/lib/football/types/match";
import type { HeadToHeadMatch } from "@/lib/football/advancedProvider";

interface Props {
  match: Match;
  headToHead: HeadToHeadMatch[];
}

export default function MatchFacts({
  match,
  headToHead,
}: Props) {
  return (
    <section className="match-facts">

      <h3>
        Match Facts
      </h3>

      <ul>

        <li>
          <strong>Competition:</strong>{" "}
          {match.competition.name}
        </li>

        <li>
          <strong>Status:</strong>{" "}
          {match.status}
        </li>

        <li>
          <strong>Kickoff:</strong>{" "}
          {new Date(
            match.kickoff
          ).toLocaleString()}
        </li>

        <li>
          <strong>Venue:</strong>{" "}
          {match.venue ?? "TBC"}
        </li>

      </ul>

      <div className="head-to-head">

        <h4>
          Previous Meetings
        </h4>

        {!headToHead.length ? (
          <p>
            No previous meetings found.
          </p>
        ) : (

          <ul>

            {headToHead.map((game) => (
              <li key={game.id}>

                <strong>
                  {game.homeTeam}
                </strong>

                {" "}
                {game.homeScore}
                {" - "}
                {game.awayScore}
                {" "}

                <strong>
                  {game.awayTeam}
                </strong>

                <br />

                <small>
                  {game.competition} ·{" "}
                  {new Date(
                    game.date
                  ).toLocaleDateString()}
                </small>

              </li>
            ))}

          </ul>

        )}

      </div>

    </section>
  );
}