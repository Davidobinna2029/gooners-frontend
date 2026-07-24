import type {
  MatchFormations,
} from "@/lib/football/intelligence/formationShiftEngine";

interface FormationCardProps {
  formations: MatchFormations;
}

export default function FormationCard({
  formations,
}: FormationCardProps) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Formation Changes
      </h2>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900">
            Home Team
          </h3>

          {formations.home.length === 0 ? (
            <p className="mt-2 text-gray-600">
              No formation changes detected.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {formations.home.map((shift, index) => (
                <li
                  key={`home-${index}`}
                  className="rounded border p-3"
                >
                  <div className="font-medium">
                    {shift.minute}'
                  </div>

                  <div className="text-sm text-gray-600">
                    {shift.fromFormation} → {shift.toFormation}
                  </div>

                  <div className="text-sm text-gray-500">
                    {shift.reason}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Away Team
          </h3>

          {formations.away.length === 0 ? (
            <p className="mt-2 text-gray-600">
              No formation changes detected.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {formations.away.map((shift, index) => (
                <li
                  key={`away-${index}`}
                  className="rounded border p-3"
                >
                  <div className="font-medium">
                    {shift.minute}'
                  </div>

                  <div className="text-sm text-gray-600">
                    {shift.fromFormation} → {shift.toFormation}
                  </div>

                  <div className="text-sm text-gray-500">
                    {shift.reason}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}