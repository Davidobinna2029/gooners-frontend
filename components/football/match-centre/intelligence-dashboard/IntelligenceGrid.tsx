import IntelligenceCard from "./IntelligenceCard";

import type {

  IntelligenceCardData,

} from "./dashboard.types";

interface Props {

  cards: IntelligenceCardData[];

}

export default function IntelligenceGrid({

  cards,

}: Props) {

  return (

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

      {cards.map(card => (

        <IntelligenceCard

          key={card.id}

          card={card}

        />

      ))}

    </div>

  );

}