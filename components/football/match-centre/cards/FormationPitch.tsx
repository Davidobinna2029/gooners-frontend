// components/football/match-centre/cards/FormationPitch.tsx

import type {
  FormationViewModel,
} from "@/lib/football/mappers/mapFormation";

interface Props {
  formation: FormationViewModel;
}

function FormationBlock({
  title,
  shape,
  color,
}: {
  title: string;
  shape: string;
  color: string;
}) {
  const isUnknown = !shape || shape === "Unknown";

  const lines = !isUnknown ? shape.split("-") : [];

  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-5">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">
        {title}
      </h3>

      <div
        className={`mb-4 rounded-full px-4 py-1 text-lg font-bold ${color}`}
      >
        {shape}
      </div>

      <div className="flex h-64 w-40 flex-col justify-between rounded-xl border border-green-700 bg-green-800 p-4">
        {isUnknown ? (
          <div className="flex h-full items-center justify-center text-center text-sm font-medium text-white">
            No formation available
          </div>
        ) : (
          <>
            {lines.map((count, rowIndex) => (
              <div
                key={rowIndex}
                className="flex justify-center gap-2"
              >
                {Array.from({
                  length: Number(count),
                }).map((_, playerIndex) => (
                  <div
                    key={playerIndex}
                    className="h-4 w-4 rounded-full bg-white shadow"
                  />
                ))}
              </div>
            ))}

            {/* Goalkeeper */}
            <div className="flex justify-center">
              <div className="h-4 w-4 rounded-full bg-yellow-300 shadow" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function FormationPitch({
  formation,
}: Props) {
  const currentHomeFormation =
    formation.home.length > 0
      ? formation.home[formation.home.length - 1].toFormation || "Unknown"
      : "Unknown";

  const currentAwayFormation =
    formation.away.length > 0
      ? formation.away[formation.away.length - 1].toFormation || "Unknown"
      : "Unknown";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormationBlock
        title="Home"
        shape={currentHomeFormation}
        color="bg-red-100 text-red-700"
      />

      <FormationBlock
        title="Away"
        shape={currentAwayFormation}
        color="bg-blue-100 text-blue-700"
      />
    </div>
  );
}