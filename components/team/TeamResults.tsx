// components/team/TeamResults.tsx

import Link from "next/link";

import type { Match } from "@/lib/football/types/match";

interface Props {
  results: Match[];
}

export default function TeamResults({
  results,
}: Props) {
  const recent = results
    .filter(
      (match) =>
        match.status === "FINISHED"
    )
    .slice(0, 5);

  if (!recent.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-4">

        <h2 className="text-xl font-bold">
          Recent Results
        </h2>

      </div>

      <div className="space-y-3">

        {recent.map((match) => (
          <Link
            key={match.id}
            href={`/match/${match.id}`}
            className="block rounded-lg border border-gray-100 p-4 transition hover:bg-gray-50"
          >

            <div className="flex items-center justify-between">

              <div>

                <div className="font-semibold">

                  {match.homeTeam.name}

                  {" vs "}

                  {match.awayTeam.name}

                </div>

                <div className="text-sm text-gray-500">

                  {match.competition.name}

                </div>

              </div>

              <div className="text-right">

                <div className="text-lg font-bold">

                  {match.score.home}

                  {" - "}

                  {match.score.away}

                </div>

                <div className="text-sm text-gray-500">

                  {new Date(
                    match.kickoff
                  ).toLocaleDateString()}

                </div>

              </div>

            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}