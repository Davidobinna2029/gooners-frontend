export interface IntelligenceCardData {

  id: string;

  title: string;

  value: string;

  description?: string;

  trend?: "up" | "down" | "neutral";

}