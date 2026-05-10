import {
  getStandings,
} from "@/lib/football";

export default async function Standings() {
  const table: any =
    await getStandings();

  return (
    <div className="table-list">
      {table
        .slice(0, 10)
        .map((club: any) => {
          const stats =
            club?.stats || [];

          const points =
            stats.find(
              (s: any) =>
                s.name ===
                "points"
            )?.value;

          return (
            <div
              key={club.team.id}
              className="table-row"
            >
              <span>
                {
                  club.team
                    .displayName
                }
              </span>

              <strong>
                {points} pts
              </strong>
            </div>
          );
        })}
    </div>
  );
}