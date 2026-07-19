// lib/football/advancedResolver.ts

import { footballConfig } from "./config";

import {
  apiFootballAdvancedProvider,
} from "./providers/apiFootball/advancedProvider";

import {
  advancedFallbackProvider,
} from "./providers/fallback/advancedFallbackProvider";

import type {
  AdvancedFootballProvider,
} from "./advancedProvider";


export function resolveAdvancedProvider(): AdvancedFootballProvider {

  switch (footballConfig.provider) {

    case "api-football":

      return apiFootballAdvancedProvider;


    case "football-data":

      /**
       * Football-Data.org has limited coverage.
       * Use safe empty responses for advanced features.
       */

      return advancedFallbackProvider;


    case "mock":

      return advancedFallbackProvider;


    default:

      return advancedFallbackProvider;
  }
}