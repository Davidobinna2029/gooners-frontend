import FactCard from "./FactCard";

import type {
  MatchFact,
} from "./facts.types";

interface Props {

  facts: MatchFact[];

}

export default function MatchFactsGrid({

  facts,

}: Props) {

  return (

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

      {facts.map(fact => (

        <FactCard

          key={fact.id}

          fact={fact}

        />

      ))}

    </div>

  );

}