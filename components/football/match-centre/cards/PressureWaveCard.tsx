import type {
  PressureWave,
} from "@/lib/football/intelligence/momentumEngine";

interface Props {
  waves: PressureWave[];
}

const levelColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  extreme: "bg-red-100 text-red-700",
};

export default function PressureWaveCard({
  waves,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h3 className="text-lg font-bold text-gray-900">
          Pressure Waves
        </h3>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {waves.length}
        </span>

      </div>

      {waves.length === 0 ? (
        <p className="text-sm text-gray-500">
          No sustained pressure periods detected.
        </p>
      ) : (
        <div className="space-y-4">

          {waves.map((wave, index) => {

            const teamColor =
              wave.team === "home"
                ? "text-red-600"
                : wave.team === "away"
                ? "text-blue-600"
                : "text-gray-600";

            return (

              <div
                key={`${wave.minuteStart}-${wave.minuteEnd}-${index}`}
                className="rounded-lg border border-gray-200 p-4"
              >

                <div className="mb-3 flex items-center justify-between">

                  <span className={`font-semibold ${teamColor}`}>
                    {wave.team.toUpperCase()}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      levelColors[wave.level]
                    }`}
                  >
                    {wave.level.toUpperCase()}
                  </span>

                </div>

                <div className="mb-2 text-sm font-medium text-gray-600">
                  {wave.minuteStart}' - {wave.minuteEnd}'
                </div>

                <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-200">

                  <div
                    className={`h-full rounded-full ${
                      wave.team === "home"
                        ? "bg-red-600"
                        : "bg-blue-600"
                    }`}
                    style={{
                      width: `${wave.intensity}%`,
                    }}
                  />

                </div>

                <p className="text-sm leading-6 text-gray-600">
                  {wave.description}
                </p>

              </div>

            );

          })}

        </div>
      )}

    </div>
  );
}