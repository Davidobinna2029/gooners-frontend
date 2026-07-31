import type { MomentumViewModel } from "@/lib/football/mappers/mapMomentum";

import MomentumOverview from "./MomentumOverview";
import MomentumBar from "./MomentumBar";
import MomentumTimeline from "./MomentumTimeline";
import PressureWaveCard from "./PressureWaveCard";
import MomentumSwingCard from "./MomentumSwingCard";

interface Props {
  momentum: MomentumViewModel;
}

export default function MomentumTimelineCard({
  momentum,
}: Props) {
  const homeWindows = momentum.timeline.filter(
    (window) => window.dominantTeam === "home"
  ).length;

  const awayWindows = momentum.timeline.filter(
    (window) => window.dominantTeam === "away"
  ).length;

  const totalWindows =
    homeWindows + awayWindows;

  const homeMomentum =
    totalWindows === 0
      ? 50
      : (homeWindows / totalWindows) * 100;

  const awayMomentum =
    totalWindows === 0
      ? 50
      : (awayWindows / totalWindows) * 100;

  return (
    <div className="space-y-6">

      {/* Overview */}

      <MomentumOverview
        momentum={momentum}
      />

      {/* Momentum Balance */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h2 className="text-lg font-bold text-gray-900">
            Momentum Balance
          </h2>

          <p className="text-sm text-gray-500">
            Overall AI momentum distribution
          </p>

        </div>

        <div className="space-y-5">

          <MomentumBar
            label="Home Momentum"
            value={homeMomentum}
            color="home"
          />

          <MomentumBar
            label="Away Momentum"
            value={awayMomentum}
            color="away"
          />

        </div>

      </div>

      {/* Timeline */}

      <MomentumTimeline
        timeline={momentum.timeline}
      />

      {/* Pressure Waves */}

      <PressureWaveCard
        waves={momentum.pressureWaves}
      />

      {/* Momentum Swings */}

      <MomentumSwingCard
        swings={momentum.swings}
      />

      {/* Confidence */}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="flex items-center justify-between">

          <span className="text-sm font-medium text-gray-600">
            AI Confidence
          </span>

          <span className="text-lg font-bold text-gray-900">
            {(momentum.confidence * 100).toFixed(0)}%
          </span>

        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-700"
            style={{
              width: `${momentum.confidence * 100}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}