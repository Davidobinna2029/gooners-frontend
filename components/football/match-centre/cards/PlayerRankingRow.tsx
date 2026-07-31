import type {
  PlayerInsight,
} from "@/lib/football/intelligence/player/ranking/types";

interface Props {
  player: PlayerInsight;
  rank: number;
}

export default function PlayerRankingRow({
  player,
  rank,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">

      {/* Rank */}

      <div className="flex items-center gap-4">

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
          {rank}
        </div>


        <div>

          <h3 className="font-semibold text-gray-900">
            {player.playerName ??
              "Unknown Player"}
          </h3>


          <p className="text-sm text-gray-500">
            Performance analysis
          </p>

        </div>

      </div>


      {/* Rating */}

      <div className="rounded-lg bg-gray-100 px-3 py-1 font-bold text-gray-900">

        {(player.rating ?? 0).toFixed(1)}

      </div>

    </div>
  );
}