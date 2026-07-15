// lib/football/resolver.ts

import { footballConfig } from "./config";
import { ProviderNotFoundError } from "./errors";

import { footballDataProvider } from "./providers/footballData/provider";
import { apiFootballProvider } from "./providers/apiFootball/provider";
import { mockProvider } from "./providers/mock/provider";

import type { FootballProvider } from "./provider";

export function resolveFootballProvider(): FootballProvider {
  switch (footballConfig.provider) {
    case "football-data":
      return footballDataProvider;

    case "api-football":
      return apiFootballProvider;

    case "mock":
      return mockProvider;

    default:
      throw new ProviderNotFoundError(
        footballConfig.provider
      );
  }
}