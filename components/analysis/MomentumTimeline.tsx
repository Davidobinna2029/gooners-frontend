import type { MatchMomentum } from "@/lib/football/intelligence/momentumEngine";

interface MomentumTimelineProps {
  momentum: MatchMomentum;
}

export default function MomentumTimeline({
  momentum,
}: MomentumTimelineProps) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Momentum Timeline
      </h2>

      <div className="mt-6 h-5 rounded bg-gray-200" />

      <p className="mt-4 text-sm text-gray-600">
        Timeline windows: {momentum.timeline.length}
      </p>

      <p className="text-sm text-gray-600">
        Pressure waves: {momentum.pressureWaves.length}
      </p>

      <p className="text-sm text-gray-600">
        Momentum swings: {momentum.swings.length}
      </p>

      <p className="text-sm text-gray-600">
        Overall winner: {momentum.overallWinner}
      </p>
    </section>
  );
}