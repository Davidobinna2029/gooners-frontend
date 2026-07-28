// lib/football/intelligence/player/types.ts

/* ==========================================================
   CAPABILITY FLAGS

   What a given provider can actually support, so the UI can hide
   unavailable analytics instead of rendering zeros that look like
   real (but bad) numbers. Raw provider parsing lives in
   lib/football/data/<provider>/mapPlayersToNormalized.ts —
   everything downstream of that (this file included) works only
   with NormalizedPlayerStats, never raw provider JSON.
========================================================== */

export interface PlayerMetricCapabilities {
  hasRatings: boolean;
  hasPassing: boolean;
  hasShooting: boolean;
  hasDefending: boolean;

  hasExpectedGoals: boolean;
  hasExpectedAssists: boolean;
  hasProgression: boolean;
  hasPressing: boolean;
}

export const API_FOOTBALL_CAPABILITIES: PlayerMetricCapabilities = {
  hasRatings: true,
  hasPassing: true,
  hasShooting: true,
  hasDefending: true,

  hasExpectedGoals: false,
  hasExpectedAssists: false,
  hasProgression: false,
  hasPressing: false,
};