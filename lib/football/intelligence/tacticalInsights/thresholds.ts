// lib/football/intelligence/tacticalInsights/thresholds.ts

export const THRESHOLDS = {

  pressing: {
    highPressPpda: 8,
    lowBlockLineHeight: 35,
    lowBlockCompactness: 70,
    midBlockMin: 35,
    midBlockMax: 65,
  },

  width: {
    narrow: 45,
    wide: 65,
  },

  tempo: {
    slow: 40,
    fast: 70,
  },

  buildUp: {
    shortBuildUpTempo: 45,
    shortBuildUpPasses: 30,
    directTempo: 65,
    directCarries: 12,
  },

  transitions: {
    counterPossession: 45,
    counterDangerousAttacks: 15,
    fastTransitionTempo: 75,
    fastTransitionDangerousAttacks: 12,
    restDefenceCompactness: 75,
    restDefenceRecoveries: 10,
  },

  possession: {
    possessionTeam: 60,
    directTeamPossession: 50,
    verticalTempo: 70,
    verticalCarries: 25,
  },

  strengths: {
    fieldTilt: 65,
    progressivePasses: 35,
    finalThirdEntries: 25,
  },

  weaknesses: {
    /** goalCreatingActions / shotCreatingActions below this reads as poor conversion */
    lowConversionRatio: 0.15,
    weakCompactness: 40,
    /** opponent's highTurnovers stands in for "how often this team lost it dangerously" */
    highTurnoversAllowed: 12,
  },

} as const;