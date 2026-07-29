import { getSeverityColor } from "./tactical.utils";
import type { TacticalInsightItem } from "./tactical.types";

interface Props {
  insight: TacticalInsightItem;
}

export default function TacticalInsightCard({
  insight,
}: Props) {

  return (

    <div
      className={`rounded-xl border-l-4 p-4 ${getSeverityColor(
        insight.severity
      )}`}
    >

      <h4 className="font-bold">

        {insight.title}

      </h4>

      <p className="mt-2 text-sm text-gray-600">

        {insight.description}

      </p>

    </div>

  );

}