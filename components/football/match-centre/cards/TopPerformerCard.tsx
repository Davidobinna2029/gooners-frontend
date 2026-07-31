// components/football/match-centre/cards/TopPerformerCard.tsx

import type {
  PlayerInsight,
} from "@/lib/football/intelligence/player/ranking/types";

interface Props {
  player: PlayerInsight;
}

export default function TopPerformerCard({
  player,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-4 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-bold text-gray-900">
            Man of the Match
          </h2>

          <p className="text-sm text-gray-500">
            AI selected top performer
          </p>

        </div>


        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
          ⭐ TOP
        </span>

      </div>


      <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">

        <div>

          <h3 className="text-xl font-bold text-gray-900">
            {player.playerName ??
              "Unknown Player"}
          </h3>


          <p className="text-sm text-gray-500">
            Match impact performance
          </p>

        </div>


        <div className="rounded-xl bg-white px-4 py-2 shadow">

          <span className="text-2xl font-bold text-gray-900">
            {(player.rating ?? 0).toFixed(1)}
          </span>

          <span className="ml-1 text-sm text-gray-500">
            /10
          </span>

        </div>

      </div>


      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

        <div className="rounded-lg bg-gray-50 p-3">
          <span className="block text-gray-500">
            Goals
          </span>

          <span className="font-bold">
            {player.goals ?? 0}
          </span>
        </div>


        <div className="rounded-lg bg-gray-50 p-3">
          <span className="block text-gray-500">
            Assists
          </span>

          <span className="font-bold">
            {player.assists ?? 0}
          </span>
        </div>


      </div>

    </div>
  );
}