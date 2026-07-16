// components/sports/Fixtures.tsx

import { getFixtures } from "@/lib/football";

import {
  FootballSection,
} from "@/src/design-system";

import EmptyState from "@/src/design-system/ui/EmptyState";

import MatchCard from "./MatchCard";

export default async function Fixtures() {
  const fixtures = await getFixtures();

  if (!fixtures.length) {
    return (
      <FootballSection title="Upcoming Fixtures">
        <EmptyState
          title="No Fixtures"
          description="Upcoming Arsenal fixtures will appear here once available."
        />
      </FootballSection>
    );
  }

  return (
    <FootballSection title="Upcoming Fixtures">
      <div className="grid gap-4">
        {fixtures.map((fixture) => (
          <MatchCard
            key={fixture.id}
            match={fixture}
          />
        ))}
      </div>
    </FootballSection>
  );
}