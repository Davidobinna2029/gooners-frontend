import type { MatchIntelligence } from "@/lib/football/intelligence/matchIntelligence";

interface MatchIntelligenceGridProps {
  intelligence: MatchIntelligence;
}

export default function MatchIntelligenceGrid({
  intelligence,
}: MatchIntelligenceGridProps) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Match Intelligence
      </h2>

      <pre className="mt-6 overflow-auto rounded bg-gray-100 p-4 text-xs">
        {JSON.stringify(intelligence, null, 2)}
      </pre>
    </section>
  );
}