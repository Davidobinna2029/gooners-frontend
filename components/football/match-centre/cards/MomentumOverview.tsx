import type {
  MomentumViewModel,
} from "@/lib/football/mappers/mapMomentum";

interface Props {
  momentum: MomentumViewModel;
}

const winnerStyle: Record<
  MomentumViewModel["overallWinner"],
  string
> = {
  home: "bg-red-100 text-red-700",
  away: "bg-blue-100 text-blue-700",
  balanced: "bg-gray-100 text-gray-700",
};

export default function MomentumOverview({
  momentum,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-4">

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <p className="text-xs uppercase tracking-wide text-gray-500">
          Overall Winner
        </p>

        <div
          className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-bold ${
            winnerStyle[momentum.overallWinner]
          }`}
        >
          {momentum.overallWinner.toUpperCase()}
        </div>

      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <p className="text-xs uppercase tracking-wide text-gray-500">
          Confidence
        </p>

        <p className="mt-3 text-3xl font-bold text-gray-900">
          {(momentum.confidence * 100).toFixed(0)}%
        </p>

      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <p className="text-xs uppercase tracking-wide text-gray-500">
          Pressure Waves
        </p>

        <p className="mt-3 text-3xl font-bold text-gray-900">
          {momentum.pressureWaves.length}
        </p>

      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <p className="text-xs uppercase tracking-wide text-gray-500">
          Momentum Swings
        </p>

        <p className="mt-3 text-3xl font-bold text-gray-900">
          {momentum.swings.length}
        </p>

      </div>

    </div>
  );
}