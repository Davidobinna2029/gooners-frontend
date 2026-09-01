// lib/football/intelligence/matchAnalysisEngine.ts

import type { MatchIntelligence } from "./matchIntelligence";

import { buildMatchMomentum } from "./momentumEngine";

import {
  calculateMatchXG,
  type MatchXG,
  type ShotEvent,
} from "./xgEngine";

import type { MatchMomentum } from "@/lib/football/types/matchEvents";

export interface MatchAnalysis {
  intelligence: MatchIntelligence;
  momentum: MatchMomentum;
  xg: MatchXG;
}

interface BuildAnalysisOptions {
  intelligence: MatchIntelligence;
  shots?: ShotEvent[];
}

export function buildMatchAnalysis({
  intelligence,
  shots = [],
}: BuildAnalysisOptions): MatchAnalysis {

  const momentum = buildMatchMomentum(
    intelligence
  );

  const xg = calculateMatchXG(
    shots
  );

  return {
    intelligence,
    momentum,
    xg,
  };

}