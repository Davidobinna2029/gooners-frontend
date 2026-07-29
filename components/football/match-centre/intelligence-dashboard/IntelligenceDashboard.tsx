import IntelligenceGrid from "./IntelligenceGrid";

import type {

  IntelligenceCardData,

} from "./dashboard.types";

interface Props {

  cards: IntelligenceCardData[];

}

export default function IntelligenceDashboard({

  cards,

}: Props) {

  return (

    <section className="rounded-2xl border bg-gray-50 p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">

        Match Intelligence

      </h2>

      {cards.length === 0 ? (

        <p className="text-gray-500">

          No intelligence available.

        </p>

      ) : (

        <IntelligenceGrid

          cards={cards}

        />

      )}

    </section>

  );

}