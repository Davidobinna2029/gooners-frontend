import { buildPrompt } from "./promptBuilder";

import { createAIClient } from "./aiClient";

import type { PromptBuilderInput } from "./promptBuilder";

/* ==========================================================
   MATCH REPORT
========================================================== */

export interface MatchReport {

  summary: string;

  model: string;

  generatedAt: string;

}

/* ==========================================================
   AI SUMMARY
========================================================== */

export async function generateMatchSummary(

  input: PromptBuilderInput

): Promise<MatchReport> {

  const prompt =
    buildPrompt(input);

  const client =
    createAIClient();

  const result =
    await client.generate({

      system: prompt.system,

      user: prompt.user,

    });

  if (!result.success) {

    throw new Error(
      "AI generation failed."
    );

  }

  return {

    summary: result.output,

    model: result.model,

    generatedAt:
      new Date().toISOString(),

  };

}