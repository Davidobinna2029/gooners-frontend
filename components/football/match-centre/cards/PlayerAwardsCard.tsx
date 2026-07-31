import type {
  PlayerAwardViewModel,
} from "@/lib/football/mappers/mapPlayerAwards";

interface Props {
  awards: PlayerAwardViewModel[];
}

export default function PlayerAwardsCard({
  awards,
}: Props) {
  if (awards.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-gray-900">
          Player Awards
        </h2>

        <p className="text-sm text-gray-500">
          No awards available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-lg font-bold text-gray-900">
        Player Awards
      </h2>

      <div className="space-y-4">

        {awards.map((award) => (
          <div
            key={award.type}
            className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
          >
            <div>
              <h3 className="font-semibold text-gray-900">
                {award.label}
              </h3>

              <p className="text-sm text-gray-500">
                {award.player.playerName ?? "Unknown Player"}
              </p>
            </div>

            <div className="rounded-lg bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
              {(award.player.rating ?? 0).toFixed(1)}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}