import IntelligenceBadge from "./IntelligenceBadge";

import {

  trendColor,

} from "./dashboard.utils";

import type {

  IntelligenceCardData,

} from "./dashboard.types";

interface Props {

  card: IntelligenceCardData;

}

export default function IntelligenceCard({

  card,

}: Props) {

  return (

    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">

          {card.title}

        </h3>

        <IntelligenceBadge

          value={card.value}

        />

      </div>

      {card.description && (

        <p className={`mt-4 text-sm ${trendColor(card.trend)}`}>

          {card.description}

        </p>

      )}

    </div>

  );

}