// lib/football/providers/fallback/advancedFallbackProvider.ts

import type {
  AdvancedFootballProvider,
} from "../../advancedProvider";


export const advancedFallbackProvider: AdvancedFootballProvider = {

  async getEvents() {
    return [];
  },


  async getStatistics() {
    return [];
  },


  async getLineups() {
    return [];
  },


  async getHeadToHead() {
    return [];
  },


  async getInjuries() {
    return [];
  },


  async getPlayers() {
    return [];
  },

};