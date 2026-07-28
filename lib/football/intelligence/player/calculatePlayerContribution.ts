// lib/football/intelligence/player/calculatePlayerContribution.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";

/**
 * Weights are a starting point for ranking players against each
 * other within a match, not a validated model — tune freely.
 * This exists so detectors (Man of the Match, Surprise Performer,
 * etc.) have a single composite number to sort on, without each
 * one re-deriving its own ad-hoc weighting.
 */
const CONTRIBUTION_WEIGHTS = {
  goals: 4,
  assists: 3,
  keyPasses: 1,
  dribblesSuccessful: 0.5,
  tackles: 0.5,
  interceptions: 0.5,
  duelsWon: 0.2,
} as const;

type ContributionInputs = Pick<
  PlayerInsight,
  | "goals"
  | "assists"
  | "keyPasses"
  | "dribblesSuccessful"
  | "tackles"
  | "interceptions"
  | "duelsWon"
>;

export function calculatePlayerContribution(
  inputs: ContributionInputs
): Pick<PlayerInsight, "contributionScore"> {

  const score =
    inputs.goals * CONTRIBUTION_WEIGHTS.goals +
    inputs.assists * CONTRIBUTION_WEIGHTS.assists +
    inputs.keyPasses * CONTRIBUTION_WEIGHTS.keyPasses +
    inputs.dribblesSuccessful * CONTRIBUTION_WEIGHTS.dribblesSuccessful +
    inputs.tackles * CONTRIBUTION_WEIGHTS.tackles +
    inputs.interceptions * CONTRIBUTION_WEIGHTS.interceptions +
    inputs.duelsWon * CONTRIBUTION_WEIGHTS.duelsWon;

  return {
    contributionScore: Math.round(score * 10) / 10,
  };

}