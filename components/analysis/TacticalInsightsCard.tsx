import type { TacticalInsight } from "@/lib/football/intelligence/tacticalInsightsEngine";

interface TacticalInsightsCardProps {
  insights: TacticalInsight[];
}

export default function TacticalInsightsCard({
  insights,
}: TacticalInsightsCardProps) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Tactical Insights
      </h2>

      <ul className="mt-4 space-y-2 text-gray-600">
        {insights.length === 0 ? (
          <li>No tactical insights available.</li>
        ) : (
          insights.map((_, index) => (
            <li key={index}>Insight #{index + 1}</li>
          ))
        )}
      </ul>
    </section>
  );
}