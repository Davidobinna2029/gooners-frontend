// components/team/TeamStandings.tsx

import type { Standing } from "@/lib/football/types/standings";

interface Props {
  standings: Standing[];
}

export default function TeamStandings({
  standings,
}: Props) {
  if (!standings.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-bold">
        League Table
      </h2>

      <div className="overflow-x-auto">

        <table className="min-w-full text-sm">

          <thead>

            <tr className="border-b">

              <th className="py-2 text-left">#</th>

              <th className="py-2 text-left">
                Club
              </th>

              <th className="py-2 text-center">
                P
              </th>

              <th className="py-2 text-center">
                GD
              </th>

              <th className="py-2 text-center">
                Pts
              </th>

            </tr>

          </thead>

          <tbody>

            {standings.map((club) => (
              <tr
                key={club.team.id}
                className="border-b last:border-0"
              >

                <td className="py-3">
                  {club.position}
                </td>

                <td className="py-3 font-medium">
                  {club.team.name}
                </td>

                <td className="py-3 text-center">
                  {club.played}
                </td>

                <td className="py-3 text-center">
                  {club.goalDifference}
                </td>

                <td className="py-3 text-center font-semibold">
                  {club.points}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}