/* ==========================================================
   PROMPT
========================================================== */

export interface AIRequest {

  system: string;

  user: string;

}

/* ==========================================================
   RESULT
========================================================== */

export interface AIResult {

  success: boolean;

  output: string;

  model: string;

  usage?: {

    inputTokens: number;

    outputTokens: number;

    totalTokens: number;

  };

}

/* ==========================================================
   PROVIDER
========================================================== */

export interface AIProvider {

  generate(
    request: AIRequest
  ): Promise<AIResult>;

}