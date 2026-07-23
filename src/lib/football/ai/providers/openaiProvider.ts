import OpenAI from "openai";

import { AI_CONFIG } from "../aiConfig";

import type {
  AIProvider,
  AIRequest,
  AIResult,
} from "../aiTypes";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIProvider implements AIProvider {

  async generate(
    request: AIRequest
  ): Promise<AIResult> {

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

        temperature: AI_CONFIG.temperature,

        max_output_tokens:
          AI_CONFIG.maxOutputTokens,

      });

    return {

      success: true,

      output: response.output_text,

      model: response.model,

      usage: response.usage
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

  }

}