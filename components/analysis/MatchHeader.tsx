// components/analysis/MatchHeader.tsx

import type { MatchViewModel } from "@/lib/football/models/matchViewModel";

interface MatchHeaderProps {
  match: MatchViewModel;
}

export default function MatchHeader({
  match,
}: MatchHeaderProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Competition */}

      <div className="mb-4 flex items-center justify-between">

        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {match.competition}
        </span>

        <span className="text-sm font-medium text-gray-500">
          {match.status}
        </span>

      </div>

      {/* Score */}

      <div className="grid grid-cols-3 items-center gap-6">

        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {match.homeTeam}
          </h2>
        </div>

        <div className="text-center">

          <div className="text-5xl font-extrabold tracking-tight">

            {match.homeScore}

            <span className="mx-3 text-gray-400">
              -
            </span>

            {match.awayScore}

          </div>

        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {match.awayTeam}
          </h2>
        </div>

      </div>

      {/* Match Details */}

      <div className="mt-8 grid gap-4 border-t pt-6 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-4">

        <div>
          <p className="font-semibold text-gray-900">
            Venue
          </p>
          <p>{match.venue}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">
            Kick-off
          </p>
          <p>{match.kickoff}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">
            Referee
          </p>
          <p>{match.referee ?? "TBC"}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">
            Attendance
          </p>
          <p>
            {match.attendance
              ? match.attendance.toLocaleString()
              : "N/A"}
          </p>
        </div>

      </div>

    </section>
  );
}