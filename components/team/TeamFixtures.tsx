// components/team/TeamFixtures.tsx

import Link from "next/link";

import type { Match } from "@/lib/football/types/match";

interface Props {
  fixtures: Match[];
}

export default function TeamFixtures({
  fixtures,
}: Props) {
  const upcoming = fixtures
    .filter(
      (fixture) =>
        fixture.status === "SCHEDULED" ||
        fixture.status === "TIMED"
    )
    .slice(0, 5);

  if (!upcoming.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-4 flex items-center justify-between">

        <h2 className="text-xl font-bold">
          Upcoming Fixtures
        </h2>

      </div>

      <div className="space-y-3">

        {upcoming.map((fixture) => (
          <Link
            key={fixture.id}
            href={`/match/${fixture.id}`}
            className="block rounded-lg border border-gray-100 p-4 transition hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">

              <div>

                <div className="font-semibold">
                  {fixture.homeTeam.name}
                  {" vs "}
                  {fixture.awayTeam.name}
                </div>

                <div className="text-sm text-gray-500">
                  {fixture.competition.name}
                </div>

              </div>

              <div className="text-right text-sm text-gray-500">

                <div>
                  {new Date(
                    fixture.kickoff
                  ).toLocaleDateString()}
                </div>

                <div>
                  {new Date(
                    fixture.kickoff
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

              </div>

            </div>
          </Link>
        ))}

      </div>

    </section>
  );
}