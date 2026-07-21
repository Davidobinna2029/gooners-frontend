import { AI_CONFIG } from "./aiConfig";

import type {

  AIProvider,

  AIRequest,

  AIResult,

} from "./aiTypes";

export class OpenAIProvider
  implements AIProvider {

  async generate(
    request: AIRequest
  ): Promise<AIResult> {

    throw new Error(
      "OpenAI provider not implemented yet."
    );

  }

}

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