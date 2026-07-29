export interface TacticalInsightItem {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface TacticalSectionData {
  title: string;
  insights: TacticalInsightItem[];
}