/* ==========================================================
   AI CONFIGURATION
========================================================== */

export const AI_CONFIG = {

  provider: "openai",

  model: "gpt-5.5",

  temperature: 0.3,

  maxOutputTokens: 1800,

  timeout: 30000,

  retries: 2,

} as const;

/* ==========================================================
   OPENAI
========================================================== */

export const OPENAI_ENDPOINT =
  "https://api.openai.com/v1/responses";