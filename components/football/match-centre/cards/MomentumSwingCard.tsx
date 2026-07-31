import type {
  MomentumShift,
} from "@/lib/football/intelligence/momentumEngine";

interface Props {
  swings: MomentumShift[];
}

const teamStyles = {
  home: "bg-red-100 text-red-700",
  away: "bg-blue-100 text-blue-700",
  balanced: "bg-gray-100 text-gray-700",
} as const;

export default function MomentumSwingCard({
  swings,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h3 className="text-lg font-bold text-gray-900">
          Momentum Swings
        </h3>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
          {swings.length}
        </span>

      </div>

      {swings.length === 0 ? (
        <p className="text-sm text-gray-500">
          No major momentum swings detected.
        </p>
      ) : (
        <div className="space-y-5">

          {swings.map((swing, index) => (

            <div
              key={`${swing.minute}-${index}`}
              className="rounded-lg border border-gray-200 p-4"
            >

              <div className="mb-3 flex items-center justify-between">

                <span className="text-lg font-bold text-gray-900">
                  {swing.minute}'
                </span>

                <div className="flex items-center gap-2">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      teamStyles[swing.from]
                    }`}
                  >
                    {swing.from.toUpperCase()}
                  </span>

                  <span className="text-gray-500">
                    →
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      teamStyles[swing.to]
                    }`}
                  >
                    {swing.to.toUpperCase()}
                  </span>

                </div>

              </div>

              <p className="text-sm leading-6 text-gray-600">
                {swing.reason}
              </p>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}