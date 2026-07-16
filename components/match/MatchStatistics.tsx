// components/match/MatchStatistics.tsx

import type { Match } from "@/lib/football/types/match";
import type { MatchStatistic } from "@/lib/football/advancedProvider";

import {
  FootballSection,
  FootballStat,
} from "@/src/design-system";

import EmptyState from "@/src/design-system/ui/EmptyState";

interface Props {
  match: Match;
  statistics?: MatchStatistic[];
}

export default function MatchStatistics({
  statistics = [],
}: Props) {
  if (!statistics.length) {
    return (
      <FootballSection title="Match Statistics">
        <EmptyState
          title="No Statistics"
          description="Statistics are not available for this match."
        />
      </FootballSection>
    );
  }

  return (
    <FootballSection title="Match Statistics">
      <div className="grid gap-4 md:grid-cols-2">
        {statistics.map((stat, index) => (
          <FootballStat
            key={`${stat.type}-${index}`}
            label={stat.type}
            homeValue={stat.home}
            awayValue={stat.away}
          />
        ))}
      </div>
    </FootballSection>
  );
}