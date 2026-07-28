import type { MatchViewModel } from "@/lib/football/models/matchViewModel";

interface Props {
  match: MatchViewModel;
}

export default function MatchCentreHeader({
  match,
}: Props) {
  return (
    <header className="rounded-2xl border bg-white p-8 shadow-sm">

      <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
        <span>{match.competition}</span>
        <span>{match.status}</span>
      </div>

      <div className="grid items-center gap-6 md:grid-cols-3">

        {/* HOME */}

        <div className="flex flex-col items-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold">
            {match.homeTeam.charAt(0)}
          </div>

          <h2 className="mt-3 text-xl font-bold text-center">
            {match.homeTeam}
          </h2>

        </div>

        {/* SCORE */}

        <div className="text-center">

          <div className="text-6xl font-black">
            {match.homeScore} - {match.awayScore}
          </div>

          <p className="mt-3 text-sm text-gray-500">
            {match.kickoff}
          </p>

          <p className="text-sm text-gray-500">
            {match.venue}
          </p>

          {match.referee && (
            <p className="mt-2 text-xs text-gray-400">
              Referee: {match.referee}
            </p>
          )}

        </div>

        {/* AWAY */}

        <div className="flex flex-col items-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold">
            {match.awayTeam.charAt(0)}
          </div>

          <h2 className="mt-3 text-xl font-bold text-center">
            {match.awayTeam}
          </h2>

        </div>

      </div>

    </header>
  );
}