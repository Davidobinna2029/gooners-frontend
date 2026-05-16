export default function Standings({
  table,
}: any) {
  if (!table?.length)
    return null;

  return (
    <section className="standings">
      <h2>Standings</h2>

      <div className="standings-table">
        {table.map((team: any) => (
          <div
            key={team.team.id}
            className="standing-row"
          >
            <span>
              {team.team.displayName}
            </span>

            <strong>
              {
                team.stats?.find(
                  (s: any) =>
                    s.name ===
                    "points"
                )?.value
              }
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}