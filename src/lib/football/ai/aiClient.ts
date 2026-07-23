import { AI_CONFIG } from "./aiConfig";

import type {
  AIProvider,
} from "./aiTypes";

import { OpenAIProvider }
  from "./providers/openaiProvider";

export function createAIClient(): AIProvider {

  switch (AI_CONFIG.provider) {

    case "openai":

      return new OpenAIProvider();

    default:

      throw new Error(
        "Unsupported AI provider."
      );

  }

}