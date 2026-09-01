// lib/football/ai/generateMatchReport.ts

import { buildPrompt } from "./promptBuilder";
import { createAIClient } from "./aiClient";
import { parseReport } from "./reportParser";
import { buildMatchAnalysis } from "./matchAnalysisEngine";

import type { MatchAnalysisContext, MatchAnalysis } from "./matchAnalysisEngine";

/* ==========================================================
   GENERATE MATCH REPORT

   Orchestrates: buildPrompt() -> AIProvider.generate() ->
   parseReport() -> AiMatchReport, falling back to the
   deterministic buildMatchAnalysis(context) at every point that
   can fail — a bad provider config, a network/API error, or a
   malformed AI response all degrade to the same rule-based report
   rather than surfacing an error to the Match Centre. AiMatchReport
   is an alias of MatchAnalysis (see reportTypes.ts), so both paths
   return the exact same shape and callers never need to branch on
   which one produced it.
========================================================== */

export async function generateMatchReport(
  context: MatchAnalysisContext
): Promise<MatchAnalysis> {

  const prompt = buildPrompt({
    intelligence: context.intelligence,
    tacticalInsights: context.tacticalInsights,
    momentum: context.momentum,
    // PromptBuilderInput's field is `formations`; MatchAnalysisContext's
    // is `formationShifts` — same MatchFormations shape, different name.
    formations: context.formationShifts,
  });

  let ai;

  try {
    ai = createAIClient();
  } catch (error) {

    console.warn(
      "[generateMatchReport] Failed to create AI client — falling back to deterministic report.",
      error instanceof Error ? error.message : error
    );

    return buildMatchAnalysis(context);

  }

  const result = await ai.generate({
    system: prompt.system,
    user: prompt.user,
  });

  if (!result.success) {

    console.warn(
      "[generateMatchReport] AI generation failed — falling back to deterministic report.",
      result.error
    );

    return buildMatchAnalysis(context);

  }

  const parsed = parseReport(result.output);

  if (!parsed.success) {

    console.warn(
      "[generateMatchReport] AI response failed validation — falling back to deterministic report.",
      parsed.error
    );

    return buildMatchAnalysis(context);

  }

  return parsed.report;

}