// components/football/match-centre/cards/FormationTimeline.tsx

import type {
  FormationViewModel,
} from "@/lib/football/mappers/mapFormation";

import FormationShiftBadge from "./FormationShiftBadge";

interface Props {
  formation: FormationViewModel;
}

export default function FormationTimeline({
  formation,
}: Props) {
  const shifts = [
    ...formation.home,
    ...formation.away,
  ].sort(
    (a, b) => a.minute - b.minute
  );

  if (shifts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-lg font-bold text-gray-900">
          Formation Timeline
        </h3>

        <p className="text-sm text-gray-500">
          No formation changes detected.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-gray-900">
        Formation Timeline
      </h3>

      <div className="space-y-5">
        {shifts.map((shift, index) => (
          <div
            key={`${shift.team}-${shift.minute}-${index}`}
            className="rounded-lg border border-gray-100 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {shift.minute}'
              </span>

              <FormationShiftBadge
                type={shift.type}
              />
            </div>

            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-lg bg-gray-100 px-3 py-1 font-semibold">
                {shift.fromFormation}
              </span>

              <span className="text-gray-500">
                →
              </span>

              <span className="rounded-lg bg-gray-100 px-3 py-1 font-semibold">
                {shift.toFormation}
              </span>
            </div>

            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {shift.team}
            </div>

            <p className="text-sm leading-6 text-gray-600">
              {shift.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}