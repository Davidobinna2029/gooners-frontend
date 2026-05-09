import {
  getStandings,
} from "@/lib/football";

export default async function Standings() {
  const table: any =
    await getStandings();

  return (
    <div className="panel">
      <h2>
        Premier League
        Standings
      </h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Club</th>
              <th>Pts</th>
            </tr>
          </thead>

          <tbody>
            {table
              ?.slice(0, 10)
              ?.map(
                (
                  club: any,
                  index: number
                ) => (
                  <tr key={index}>
                    <td>
                      {index + 1}
                    </td>

                    <td>
                      {
                        club.team
                          ?.displayName
                      }
                    </td>

                    <td>
                      {
                        club.stats?.find(
                          (
                            s: any
                          ) =>
                            s.name ===
                            "points"
                        )?.value
                      }
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}