// lib/football/providers/mock/provider.ts

import type { FootballProvider } from "../../provider";

export const mockProvider: FootballProvider = {
  async getNextMatch() {
    return null;
  },

  async getFixtures() {
    return [];
  },

  async getResults() {
    return [];
  },

  async getStandings() {
    return [];
  },

  async getMatch() {
    return null;
  },

  async getTeam() {
    return null;
  },
};