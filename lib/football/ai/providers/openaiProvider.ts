// lib/football/ai/providers/openaiProvider.ts

import OpenAI from "openai";

import { AI_CONFIG } from "../aiConfig";

import type {
  AIProvider,
  AIRequest,
  AIResult,
} from "../aiTypes";

/* ==========================================================
   LAZY OPENAI CLIENT

   The client is created only when an AI request is actually
   made. This allows the application to build successfully
   when OPENAI_API_KEY is not configured.

   If the key is missing, OpenAIProvider.generate() returns
   a normal AIResult failure and generateMatchReport() falls
   back to the deterministic match-analysis engine.
========================================================== */

function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured."
    );
  }

  return new OpenAI({
    apiKey,
  });
}

/* ==========================================================
   OPENAI PROVIDER
========================================================== */

export class OpenAIProvider implements AIProvider {

  async generate(
    request: AIRequest
  ): Promise<AIResult> {

    try {

      const client =
        createOpenAIClient();

      const response =
        await client.responses.create({

          model: AI_CONFIG.model,

          input: [

            {
              role: "system",
              content: request.system,
            },

            {
              role: "user",
              content: request.user,
            },

          ],

          temperature:
            AI_CONFIG.temperature,

          max_output_tokens:
            AI_CONFIG.maxOutputTokens,

        });

      return {

        success: true,

        output:
          response.output_text,

        model:
          response.model,

        usage:
          response.usage
            ? {
                inputTokens:
                  response.usage.input_tokens,

                outputTokens:
                  response.usage.output_tokens,

                totalTokens:
                  response.usage.total_tokens,
              }
            : undefined,

      };

    } catch (error) {

      return {

        success: false,

        output: "",

        model:
          AI_CONFIG.model,

        error:
          error instanceof Error
            ? error.message
            : "Unknown OpenAI error",

      };

    }

  }

}