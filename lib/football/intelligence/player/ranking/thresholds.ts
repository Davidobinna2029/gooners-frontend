// lib/football/intelligence/player/ranking/thresholds.ts

export const RANKING_WEIGHTS = {

  bestAttacker: {
    goals: 5,
    shots: 0.5,
    shotsOnTarget: 1,
  },

  bestCreator: {
    assists: 4,
    keyPasses: 1.5,
  },

  bestDefender: {
    tackles: 1,
    interceptions: 1,
    duelsWon: 0.5,
  },

  bestPasser: {
    passesCompleted: 0.05,
    passAccuracy: 0.3,
    keyPasses: 1,
  },

  /**
   * Deliberately weighted differently from bestAttacker: this
   * favors shot volume/quality and dribbling threat over actual
   * end product, so it can highlight a player who caused problems
   * without necessarily scoring — distinct from "who scored/nearly
   * scored the most."
   */
  biggestThreat: {
    shotsOnTarget: 2,
    dribblesSuccessful: 1,
    goals: 2,
  },

} as const;

export const RANKING_THRESHOLDS = {
  /** Minutes required before a player is eligible for MOTM or underperformer consideration — a 10-minute cameo shouldn't win or lose on a tiny sample. */
  minMinutesForRecognition: 45,
} as const;