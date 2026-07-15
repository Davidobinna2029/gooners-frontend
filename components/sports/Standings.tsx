// components/sports/Standings.tsx

import { getStandings } from "@/lib/football";

export default async function Standings() {
  const table =
    await getStandings();

  if (!table.length) {
    return null;
  }

  return (
    <section className="standings">
      <h2>
        Premier League Table
      </h2>

      <div className="standings-table">

        <div className="standing-row standing-header">
          <span>Team</span>
          <span>MP</span>
          <span>W</span>
          <span>D</span>
          <span>L</span>
          <span>GD</span>
          <span>PTS</span>
        </div>


        {table.map((standing) => (
          <div
            key={standing.team.id}
            className="standing-row"
          >
            <span className="team-name">
              {standing.position}.{" "}
              {standing.team.name}
            </span>

            <span>
              {standing.played}
            </span>

            <span>
              {standing.won}
            </span>

            <span>
              {standing.draw}
            </span>

            <span>
              {standing.lost}
            </span>

            <span>
              {standing.goalDifference}
            </span>

            <strong>
              {standing.points}
            </strong>
          </div>
        ))}

      </div>
    </section>
  );
}