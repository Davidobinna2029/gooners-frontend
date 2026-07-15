// components/team/TeamSquad.tsx

import type {
  PlayerProfile,
} from "@/lib/football/advancedProvider";

interface Props {
  players: PlayerProfile[];
}

export default function TeamSquad({
  players,
}: Props) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-bold">
        Squad
      </h2>

      {!players.length ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center">

          <p className="font-medium text-gray-700">
            Squad data isn't available with the current football provider.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Player information will automatically appear after switching to the
            API-Football provider.
          </p>

        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {players.map((player) => (
            <article
              key={player.id}
              className="rounded-lg border border-gray-200 p-4"
            >

              <h3 className="font-semibold">
                {player.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {player.position ?? "Unknown Position"}
              </p>

              {player.number && (
                <p className="mt-2 text-sm">
                  Number: {player.number}
                </p>
              )}

              {player.nationality && (
                <p className="text-sm">
                  {player.nationality}
                </p>
              )}

            </article>
          ))}

        </div>
      )}

    </section>
  );
}