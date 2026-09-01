// lib/football/ai/reportParser.ts

import type { AiMatchReport } from "./reportTypes";

/* ==========================================================
   PARSE RESULT

   A tagged union rather than "return null on failure" or
   "throw on failure" — generateMatchReport.ts's fallback branch
   (parseReport() success? → yes/no) reads directly off `success`
   without a try/catch, and a failed parse always carries a
   human-readable `error` for logging instead of a bare null.
========================================================== */

export type ParsedReportResult =
  | { success: true; report: AiMatchReport }
  | { success: false; error: string };

/* ==========================================================
   REQUIRED SHAPE

   Mirrors AiMatchReport (= MatchAnalysis) field for field. Kept
   as a local list rather than reflecting over the type at runtime
   — TypeScript types don't exist at runtime, so the fields the
   parser checks have to be spelled out explicitly regardless.
========================================================== */

const REQUIRED_STRING_FIELDS = [
  "headline",
  "summary",
  "verdict",
] as const;

const REQUIRED_STRING_ARRAY_FIELDS = [
  "keyFindings",
  "tacticalStory",
  "strengths",
  "weaknesses",
  "turningPoints",
  "playerHighlights",
  "coachingAssessment",
] as const;

/* ==========================================================
   STRIP CODE FENCES

   Models frequently wrap JSON in ```json ... ``` even when told
   not to. Stripping is tolerant of that without being required —
   plain JSON passes through untouched.
========================================================== */

function stripCodeFences(raw: string): string {

  const trimmed = raw.trim();

  const fenced = trimmed.match(
    /^```(?:json)?\s*([\s\S]*?)\s*```$/i
  );

  return fenced ? fenced[1].trim() : trimmed;

}

/* ==========================================================
   VALIDATE SHAPE

   Runtime type guard — the AI's output is untrusted input, not a
   TypeScript value, so every field is checked before anything
   downstream (the Match Centre UI) is allowed to treat it as a
   real AiMatchReport.
========================================================== */

function validateShape(
  value: unknown
): value is AiMatchReport {

  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof record[field] !== "string" || !record[field]) {
      return false;
    }
  }

  for (const field of REQUIRED_STRING_ARRAY_FIELDS) {
    const arr = record[field];
    if (
      !Array.isArray(arr) ||
      !arr.every(item => typeof item === "string")
    ) {
      return false;
    }
  }

  return true;

}

/* ==========================================================
   PUBLIC API
========================================================== */

/**
 * Parses a raw text response from an AI provider into a validated
 * AiMatchReport. Never throws — callers (generateMatchReport.ts)
 * branch on `result.success` and fall back to buildMatchAnalysis()
 * on failure rather than letting a malformed AI response reach the
 * Match Centre UI.
 */
export function parseReport(
  raw: string
): ParsedReportResult {

  const candidate = stripCodeFences(raw);

  let parsed: unknown;

  try {
    parsed = JSON.parse(candidate);
  } catch {
    return {
      success: false,
      error: "AI response was not valid JSON.",
    };
  }

  if (!validateShape(parsed)) {
    return {
      success: false,
      error: "AI response JSON did not match the expected AiMatchReport shape.",
    };
  }

  return {
    success: true,
    report: parsed,
  };

}