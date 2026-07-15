// lib/football/index.ts

import { resolveFootballProvider } from "./resolver";

const provider = resolveFootballProvider();

export const getNextMatch =
  provider.getNextMatch.bind(provider);

export const getFixtures =
  provider.getFixtures.bind(provider);

export const getResults =
  provider.getResults.bind(provider);

export const getStandings =
  provider.getStandings.bind(provider);

export const getMatch =
  provider.getMatch.bind(provider);

export const getTeam =
  provider.getTeam.bind(provider);