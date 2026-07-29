import MomentumBar from "./MomentumBar";
import MomentumSummary from "./MomentumSummary";

import {
  normalizeMomentum,
} from "./momentum.utils";

import type {
  MomentumPoint,
  MomentumSummary as MomentumSummaryType,
} from "./momentum.types";

interface Props {
  data: MomentumPoint[];
  summary: MomentumSummaryType;
}

export default function MomentumGraph({
  data,
  summary,
}: Props) {

  const points =
    normalizeMomentum(data);

  return (

    <section className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">

        Match Momentum

      </h2>

      <MomentumSummary
        summary={summary}
      />

      <div className="mt-8">

        <div className="flex items-end gap-1 overflow-x-auto">

          {points.map((point) => (

            <MomentumBar
              key={`${point.minute}-${point.home}-${point.away}`}
              point={point}
            />

          ))}

        </div>

      </div>

    </section>

  );

}