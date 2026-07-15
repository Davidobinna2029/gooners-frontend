// lib/football/supportsAdvanced.ts

import { footballConfig } from "./config";

export function supportsAdvancedProvider() {
  return footballConfig.provider === "api-football";
}