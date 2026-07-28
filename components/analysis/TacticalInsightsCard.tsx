// components/analysis/TacticalInsightsCard.tsx

import type {
  MatchTacticalInsights,
  TacticalInsight,
  TacticalInsights,
} from "@/lib/football/intelligence/tacticalInsights";

interface TacticalInsightsCardProps {
  insights: MatchTacticalInsights;
  homeName?: string;
  awayName?: string;
}

const CATEGORY_ORDER: Array<keyof TacticalInsights> = [
  "attacking",
  "defending",
  "transition",
  "possession",
];

const CATEGORY_LABELS: Record<keyof TacticalInsights, string> = {
  attacking: "Attacking",
  defending: "Defending",
  transition: "Transition",
  possession: "Possession",
};

function InsightItem({ insight }: { insight: TacticalInsight }) {
  return (
    <li className="border-l-2 border-gray-200 pl-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-medium text-gray-900">{insight.title}</span>
        <span className="shrink-0 text-xs text-gray-400">
          {Math.round(insight.confidence * 100)}%
        </span>
      </div>
      <p className="text-sm text-gray-600">{insight.description}</p>
      {insight.evidence.length > 0 && (
        <p className="mt-0.5 text-xs text-gray-400">
          {insight.evidence.join(" · ")}
        </p>
      )}
    </li>
  );
}

function TeamInsightsColumn({
  label,
  insights,
}: {
  label: string;
  insights: TacticalInsights;
}) {
  const hasAny = CATEGORY_ORDER.some(
    (category) => insights[category].length > 0
  );

  return (
    <div className="flex-1 min-w-0">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </h3>

      {!hasAny ? (
        <p className="text-sm text-gray-400">
          No tactical insights available.
        </p>
      ) : (
        <div className="space-y-4">
          {CATEGORY_ORDER.map((category) =>
            insights[category].length > 0 ? (
              <div key={category}>
                <h4 className="mb-1.5 text-xs font-medium uppercase text-gray-400">
                  {CATEGORY_LABELS[category]}
                </h4>
                <ul className="space-y-2">
                  {insights[category].map((insight) => (
                    <InsightItem key={insight.id} insight={insight} />
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export default function TacticalInsightsCard({
  insights,
  homeName = "Home",
  awayName = "Away",
}: TacticalInsightsCardProps) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Tactical Insights</h2>

      <div className="mt-4 flex flex-col gap-6 md:flex-row md:gap-8">
        <TeamInsightsColumn label={homeName} insights={insights.home} />
        <TeamInsightsColumn label={awayName} insights={insights.away} />
      </div>
    </section>
  );
}