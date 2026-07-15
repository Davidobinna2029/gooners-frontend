import { getResults } from "@/lib/football";

import MatchCard from "./MatchCard";

export default async function Results() {
  const results =
    await getResults();

  if (!results.length) {
    return (
      <section>

        <h2>
          Results
        </h2>

        <p>
          No recent matches.
        </p>

      </section>
    );
  }

  return (
    <section>

      <h2>
        Results
      </h2>

      <div className="grid gap-4">

        {results.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
          />
        ))}

      </div>

    </section>
  );
}