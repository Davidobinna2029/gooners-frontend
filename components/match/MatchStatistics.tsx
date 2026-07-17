// components/match/MatchStatistics.tsx

import type {
  MatchStatistic,
} from "@/lib/football/advancedProvider";

import {
  FootballSection,
  FootballStatBar,
} from "@/src/design-system";

import EmptyState from "@/src/design-system/ui/EmptyState";

interface Props {
  statistics?: MatchStatistic[];
}

function parseNumeric(value: string | number | null | undefined): number {
  if (typeof value === "number") return value;

  if (!value) return 0;

  const cleaned = String(value)
    .replace("%", "")
    .replace(",", "")
    .trim();

  const parsed = Number(cleaned);

  return Number.isNaN(parsed) ? 0 : parsed;
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
      <div className="space-y-5">
        {statistics.map((stat, index) => (
          <FootballStatBar
            key={`${stat.type}-${index}`}
            label={stat.type}
            home={parseNumeric(stat.home)}
            away={parseNumeric(stat.away)}
            homeDisplay={String(stat.home ?? "-")}
            awayDisplay={String(stat.away ?? "-")}
          />
        ))}
      </div>
    </FootballSection>
  );
}