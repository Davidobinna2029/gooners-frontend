import type {
  MatchTacticalInsights,
  TacticalInsight,
} from "@/lib/football/intelligence/tacticalInsights";

export interface MatchReportViewModel {
  insights: TacticalInsight[];
}

export function mapMatchReport(
  insights: MatchTacticalInsights
): MatchReportViewModel {
  return {
    insights: [
      ...insights.home.attacking,
      ...insights.home.defending,
      ...insights.home.transition,
      ...insights.home.possession,

      ...insights.away.attacking,
      ...insights.away.defending,
      ...insights.away.transition,
      ...insights.away.possession,
    ],
  };
}