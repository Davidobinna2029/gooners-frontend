import MatchFactsGrid from "./MatchFactsGrid";

import type {
  MatchFact,
} from "./facts.types";

interface Props {

  facts: MatchFact[];

}

export default function MatchFacts({

  facts,

}: Props) {

  return (

    <section className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">

        Match Facts

      </h2>

      {facts.length === 0 ? (

        <p className="text-gray-500">

          Match facts unavailable.

        </p>

      ) : (

        <MatchFactsGrid
          facts={facts}
        />

      )}

    </section>

  );

}