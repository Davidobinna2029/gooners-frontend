import type { MatchReportViewModel } from "@/lib/football/mappers/mapMatchReport";

interface Props {
  report: MatchReportViewModel;
}

const categoryColor: Record<string, string> = {
  attack: "bg-red-100 text-red-700",
  defence: "bg-blue-100 text-blue-700",
  transition: "bg-purple-100 text-purple-700",
  pressing: "bg-orange-100 text-orange-700",
  shape: "bg-green-100 text-green-700",
  possession: "bg-emerald-100 text-emerald-700",
};

function formatCategory(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function TacticalInsightsCard({
  report,
}: Props) {
  if (report.insights.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-bold">
          Tactical Insights
        </h2>

        <p className="text-sm text-gray-500">
          No tactical insights generated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {report.insights.map((insight) => (

        <div
          key={insight.id}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >

          <div className="mb-3 flex items-center gap-2">

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                categoryColor[insight.category] ??
                "bg-gray-100 text-gray-700"
              }`}
            >
              {formatCategory(insight.category)}
            </span>

          </div>

          <h3 className="mb-2 text-lg font-bold text-gray-900">
            {insight.title}
          </h3>

          <p className="mb-5 text-sm leading-6 text-gray-600">
            {insight.description}
          </p>

          <div className="mb-4">

            <div className="mb-1 flex justify-between text-xs">

              <span className="font-medium text-gray-500">
                AI Confidence
              </span>

              <span className="font-semibold text-gray-700">
                {Math.round(insight.confidence * 100)}%
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-200">

              <div
                className="h-full rounded-full bg-red-600"
                style={{
                  width: `${insight.confidence * 100}%`,
                }}
              />

            </div>

          </div>

          {insight.evidence.length > 0 && (

            <div>

              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                Supporting Evidence
              </h4>

              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">

                {insight.evidence.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}

              </ul>

            </div>

          )}

        </div>

      ))}

    </div>
  );
}