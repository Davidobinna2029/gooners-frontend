import type { MatchFactsViewModel } from "@/lib/football/mappers/mapMatchFacts";

interface Props {
  facts: MatchFactsViewModel;
}

export default function SummaryTiles({
  facts,
}: Props) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      <SummaryTile
        label="Competition"
        value={facts.competition ?? "Unknown"}
      />

      <SummaryTile
        label="Venue"
        value={facts.venue ?? "Unknown"}
      />

      <SummaryTile
        label="Kick Off"
        value={facts.kickoff ?? "Unknown"}
      />

      <SummaryTile
        label="Round"
        value={facts.round ?? "Unknown"}
      />

    </div>
  );
}

interface SummaryTileProps {
  label: string;
  value: string | number;
}

function SummaryTile({
  label,
  value,
}: SummaryTileProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all duration-300 hover:border-gray-200 hover:bg-white">

      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-gray-900 break-words">
        {value}
      </p>

    </div>
  );
}