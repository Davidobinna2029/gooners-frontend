// components/team/TeamNextMatch.tsx

import Link from "next/link";

import type { Match } from "@/lib/football/types/match";

interface Props {
  fixtures: Match[];
}

export default function TeamNextMatch({
  fixtures,
}: Props) {
  const nextMatch = fixtures.find(
    (fixture) =>
      fixture.status === "SCHEDULED" ||
      fixture.status === "TIMED"
  );

  if (!nextMatch) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-4 flex items-center justify-between">

        <h2 className="text-xl font-bold">
          Next Match
        </h2>

        <Link
          href={`/match/${nextMatch.id}`}
          className="text-sm font-medium text-red-600 hover:underline"
        >
          Match Centre →
        </Link>

      </div>

      <div className="grid grid-cols-3 items-center text-center">

        <div>

          <h3 className="font-semibold">
            {nextMatch.homeTeam.name}
          </h3>

        </div>

        <div>

          <p className="text-lg font-bold text-gray-500">
            VS
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {new Date(
              nextMatch.kickoff
            ).toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {nextMatch.competition.name}
          </p>

        </div>

        <div>

          <h3 className="font-semibold">
            {nextMatch.awayTeam.name}
          </h3>

        </div>

      </div>

    </section>
  );
}