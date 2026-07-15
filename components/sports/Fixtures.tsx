// components/sports/Fixtures.tsx

import { getFixtures } from "@/lib/football";

import MatchCard from "./MatchCard";

export default async function Fixtures() {
  const fixtures =
    await getFixtures();

  if (!fixtures.length) {
    return (
      <section className="fixtures">

        <h2>
          Upcoming Fixtures
        </h2>

        <p>
          No fixtures available.
        </p>

      </section>
    );
  }

  return (
    <section className="fixtures">

      <h2>
        Upcoming Fixtures
      </h2>

      <div className="grid gap-4">

        {fixtures.map((fixture) => (
          <MatchCard
            key={fixture.id}
            match={fixture}
          />
        ))}

      </div>

    </section>
  );
}