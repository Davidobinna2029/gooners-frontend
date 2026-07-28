// lib/football/intelligence/tacticalInsights/helpers.ts

import type { TacticalCategory, TacticalInsight } from "./types";

export function createInsight(
  id: string,
  title: string,
  category: TacticalCategory,
  confidence: number,
  description: string,
  evidence: string[]
): TacticalInsight {
  return {
    id,
    title,
    description,
    category,
    confidence,
    evidence,
  };
}