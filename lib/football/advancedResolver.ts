// lib/football/advancedResolver.ts

import { footballConfig } from "./config";
import { ProviderNotFoundError } from "./errors";

import {
  apiFootballAdvancedProvider,
} from "./providers/apiFootball/advancedProvider";

import type {
  AdvancedFootballProvider,
} from "./advancedProvider";


export function resolveAdvancedProvider(): AdvancedFootballProvider {
  switch (footballConfig.provider) {
    case "api-football":
      return apiFootballAdvancedProvider;

    case "football-data":
      throw new ProviderNotFoundError(
        "Football Data does not support advanced features"
      );

    case "mock":
      throw new ProviderNotFoundError(
        "Mock provider does not support advanced features"
      );

    default:
      throw new ProviderNotFoundError(
        footballConfig.provider
      );
  }
}