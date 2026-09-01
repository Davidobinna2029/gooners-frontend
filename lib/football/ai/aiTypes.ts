/* ==========================================================
   PROMPT
========================================================== */

export interface AIRequest {

  system: string;

  user: string;

}

/* ==========================================================
   TOKEN USAGE
========================================================== */

export interface AIUsage {

  inputTokens: number;

  outputTokens: number;

  totalTokens: number;

}

/* ==========================================================
   RESULT
========================================================== */

export interface AIResult {

  /**
   * True when the provider successfully generated a response.
   */
  success: boolean;

  /**
   * Raw text returned by the model.
   * Empty string when generation fails.
   */
  output: string;

  /**
   * Model that produced (or attempted to produce) the response.
   */
  model: string;

  /**
   * Token usage returned by the provider.
   */
  usage?: AIUsage;

  /**
   * Provider error message.
   * Present only when success === false.
   */
  error?: string;

}

/* ==========================================================
   PROVIDER
========================================================== */

export interface AIProvider {

  generate(
    request: AIRequest
  ): Promise<AIResult>;

}