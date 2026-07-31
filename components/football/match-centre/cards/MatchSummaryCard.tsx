import type { MatchViewModel } from "@/lib/football/models/matchViewModel";
import type { MatchFactsViewModel } from "@/lib/football/mappers/mapMatchFacts";

interface Props {
  match: MatchViewModel;
  facts: MatchFactsViewModel;
}

export default function MatchSummaryCard({
  match,
  facts,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

      <div className="border-b px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900">
          Match Summary
        </h2>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">

        <SummaryItem
          label="Competition"
          value={facts.competition ?? "Unknown"}
        />

        <SummaryItem
          label="Venue"
          value={facts.venue ?? "Unknown"}
        />

        <SummaryItem
          label="Kick Off"
          value={facts.kickoff ?? "Unknown"}
        />

        <SummaryItem
          label="Round"
          value={facts.round ?? "Unknown"}
        />

        <SummaryItem
          label="Home Team"
          value={facts.homeTeam.name}
        />

        <SummaryItem
          label="Away Team"
          value={facts.awayTeam.name}
        />

        <SummaryItem
          label="Score"
          value={`${facts.score.home} - ${facts.score.away}`}
        />

        <SummaryItem
          label="Formation"
          value={`${facts.homeTeam.formation ?? "—"} / ${facts.awayTeam.formation ?? "—"}`}
        />

      </div>

    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value: string | number;
}

function SummaryItem({
  label,
  value,
}: SummaryItemProps) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}