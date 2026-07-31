import type {
  FormationViewModel,
} from "@/lib/football/mappers/mapFormation";

import FormationPitch from "./FormationPitch";
import FormationTimeline from "./FormationTimeline";

interface Props {
  formation: FormationViewModel;
}

export default function FormationChangesCard({
  formation,
}: Props) {
  const totalShifts =
    formation.home.length +
    formation.away.length;

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Formation Changes
            </h2>

            <p className="text-sm text-gray-500">
              Tactical shape evolution throughout the match
            </p>

          </div>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
            {totalShifts} Shift{totalShifts !== 1 ? "s" : ""}
          </span>

        </div>

      </div>

      {/* Current Formation */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <h3 className="text-lg font-bold text-gray-900">
            Current Shapes
          </h3>

          <p className="text-sm text-gray-500">
            Final formations used by both teams
          </p>

        </div>

        <FormationPitch
          formation={formation}
        />

      </div>

      {/* Timeline */}

      <FormationTimeline
        formation={formation}
      />

    </div>
  );
}