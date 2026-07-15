// components/team/TeamInjuries.tsx

import type {
  Injury,
} from "@/lib/football/advancedProvider";

interface Props {
  injuries: Injury[];
}

export default function TeamInjuries({
  injuries,
}: Props) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-bold">
        Injuries
      </h2>

      {!injuries.length ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center">

          <p className="font-medium text-gray-700">
            Injury data isn't available with the current football provider.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Injury reports will automatically appear after switching to
            API-Football.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {injuries.map((injury) => (
            <article
              key={injury.playerId}
              className="rounded-lg border border-gray-200 p-4"
            >

              <h3 className="font-semibold">
                {injury.player}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {injury.injury}
              </p>

              {injury.reason && (
                <p className="mt-2 text-sm text-gray-500">
                  Reason: {injury.reason}
                </p>
              )}

              {injury.expectedReturn && (
                <p className="mt-1 text-sm text-gray-500">
                  Expected return: {injury.expectedReturn}
                </p>
              )}

            </article>
          ))}

        </div>
      )}

    </section>
  );
}