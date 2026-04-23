import {
  getPremierLeagueStandings,
} from "@/lib/football";

export default async function Standings() {
  const table =
    await getPremierLeagueStandings();

  return (
    <div className="panel">
      <h2>Premier League Table</h2>

      <div className="table-list">
        {table
          .slice(0, 10)
          .map((club: any) => (
            <div
              key={club.team.id}
              className="table-row"
            >
              <span>
                {club.rank}.{" "}
                {club.team.name}
              </span>

              <strong>
                {club.points}
              </strong>
            </div>
          ))}
      </div>
    </div>
  );
}