import type {
  MatchFact,
} from "./facts.types";

interface Props {

  fact: MatchFact;

}

export default function FactCard({

  fact,

}: Props) {

  return (

    <div className="rounded-xl border bg-white p-4 shadow-sm">

      <p className="text-xs uppercase tracking-wide text-gray-500">

        {fact.label}

      </p>

      <p className="mt-2 text-lg font-bold">

        {fact.value}

      </p>

    </div>

  );

}