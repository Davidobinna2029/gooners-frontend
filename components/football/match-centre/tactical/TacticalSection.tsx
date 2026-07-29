import TacticalInsightCard from "./TacticalInsightCard";
import type { TacticalSectionData } from "./tactical.types";

interface Props {
  section: TacticalSectionData;
}

export default function TacticalSection({
  section,
}: Props) {

  return (

    <section>

      <h3 className="mb-4 text-xl font-bold">

        {section.title}

      </h3>

      <div className="space-y-4">

        {section.insights.length === 0 ? (

          <p className="text-sm text-gray-500">

            No tactical insights.

          </p>

        ) : (

          section.insights.map(insight => (

            <TacticalInsightCard
              key={insight.id}
              insight={insight}
            />

          ))

        )}

      </div>

    </section>

  );

}