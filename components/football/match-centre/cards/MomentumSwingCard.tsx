import type { MomentumShift } from "@/lib/football/types/matchEvents";

interface Props {
  swings: MomentumShift[];
}

export default function MomentumSwingCard({
  swings,
}: Props) {
  if (swings.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900">
          Momentum Swings
        </h3>

        <p className="mt-3 text-sm text-gray-500">
          No major momentum swings detected.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-lg font-bold text-gray-900">
        Momentum Swings
      </h3>

      <div className="space-y-4">
        {swings.map((swing, index) => (
          <div
            key={`${swing.minute}-${index}`}
            className="rounded-lg border border-gray-100 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                {swing.minute}'
              </span>

              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {swing.from.toUpperCase()} → {swing.to.toUpperCase()}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              {swing.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}