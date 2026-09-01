// lib/football/ai/reportTypes.ts

import type { MatchAnalysis } from "./matchAnalysisEngine";

export type AiMatchReport = MatchAnalysis;

export interface AiGenerationMetadata {
  model: string;
  generatedAt: string;
  promptVersion: string;
}

export interface AiMatchReportResponse {
  report: AiMatchReport;
  metadata: AiGenerationMetadata;
}