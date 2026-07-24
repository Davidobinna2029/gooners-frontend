import type { MatchAnalysis } from "@/lib/football/ai/matchAnalysisEngine";

interface MatchAnalysisCardProps {
  analysis: MatchAnalysis;
}

export default function MatchAnalysisCard({
  analysis,
}: MatchAnalysisCardProps) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">
        Match Report
      </h2>

      <div className="mt-4 space-y-4 text-gray-700">
        {/* Adjust these fields to match your MatchAnalysis type */}
        {"summary" in analysis && (
          <p>{analysis.summary}</p>
        )}

        {"keyTakeaways" in analysis &&
          Array.isArray(analysis.keyTakeaways) && (
            <ul className="list-disc pl-5 space-y-1">
              {analysis.keyTakeaways.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
      </div>
    </section>
  );
}