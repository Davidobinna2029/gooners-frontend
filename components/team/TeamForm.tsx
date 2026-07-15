// components/team/TeamForm.tsx

import type { Standing } from "@/lib/football/types/standings";

interface Props {
  standings: Standing[];
}

export default function TeamForm({
  standings,
}: Props) {
  if (!standings.length) {
    return null;
  }

  const team = standings[0];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-4 text-xl font-bold">
        League Performance
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

        <div>
          <p className="text-sm text-gray-500">
            Position
          </p>

          <p className="text-2xl font-bold">
            #{team.position}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Played
          </p>

          <p className="text-2xl font-bold">
            {team.played}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Points
          </p>

          <p className="text-2xl font-bold">
            {team.points}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Goal Difference
          </p>

          <p className="text-2xl font-bold">
            {team.goalDifference}
          </p>
        </div>

      </div>

      {team.form && (
        <div className="mt-6">

          <p className="mb-2 text-sm text-gray-500">
            Recent Form
          </p>

          <p className="font-semibold tracking-wide">
            {team.form}
          </p>

        </div>
      )}

    </section>
  );
}