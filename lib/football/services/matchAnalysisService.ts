// ==========================================================
// Match Analysis Service
// Central Football Intelligence Orchestrator
// ArsenalTalks
// ==========================================================

import { loadMatchData } from "@/lib/football/data/loadMatchData";
import { mapMatchToViewModel } from "@/lib/football/mappers/mapMatchToViewModel";

import {
  buildMatchIntelligence,
} from "@/lib/football/intelligence/matchIntelligence";

import {
  buildTacticalInsights,
} from "@/lib/football/intelligence/tacticalInsightsEngine";

import {
  buildMatchMomentum,
} from "@/lib/football/intelligence/momentumEngine";

import {
  buildFormationShifts,
} from "@/lib/football/intelligence/formationShiftEngine";

import {
  buildMatchAnalysis,
} from "@/lib/football/ai/matchAnalysisEngine";

import type {
  MatchViewModel,
} from "@/lib/football/models/matchViewModel";

import type {
  MatchIntelligence,
} from "@/lib/football/intelligence/matchIntelligence";

import type {
  TacticalInsight,
} from "@/lib/football/intelligence/tacticalInsightsEngine";

import type {
  MatchMomentum,
} from "@/lib/football/intelligence/momentumEngine";

import type {
  MatchFormations,
} from "@/lib/football/intelligence/formationShiftEngine";

import type {
  MatchAnalysis,
} from "@/lib/football/ai/matchAnalysisEngine";

// ==========================================================
// Future Types
// ==========================================================

export interface MatchStatistic {
  label: string;
  home: number | string;
  away: number | string;
}

export interface TimelineEvent {
  minute: number;
  type: string;
  team: "home" | "away";
  title: string;
  description?: string;
}

export interface PlayerRating {
  playerId: string;
  playerName: string;
  team: "home" | "away";
  rating: number;
}

// ==========================================================
// Public Response
// ==========================================================

export interface MatchAnalysisResponse {
  /**
   * Match Header
   */
  match: MatchViewModel;

  /**
   * Raw Provider Response
   */
  rawMatch: unknown;

  /**
   * Football Intelligence
   */
  intelligence: MatchIntelligence;

  /**
   * Tactical Engine
   */
  tacticalInsights: TacticalInsight[];

  /**
   * Momentum Engine
   */
  momentum: MatchMomentum;

  /**
   * Formation Engine
   */
  formationShifts: MatchFormations;

  /**
   * Editorial Report
   */
  report: MatchAnalysis;

  /**
   * Timeline
   */
  timeline: TimelineEvent[];

  /**
   * Statistics
   */
  statistics: MatchStatistic[];

  /**
   * Player Ratings
   */
  playerRatings: PlayerRating[];

  /**
   * Metadata
   */
  generatedAt: string;
}

// ==========================================================
// Service
// ==========================================================

export async function getMatchAnalysis(
  matchId: string
): Promise<MatchAnalysisResponse> {

  //----------------------------------------------------------
  // Load Provider Data
  //----------------------------------------------------------

  const rawMatch = await loadMatchData(matchId);

  //----------------------------------------------------------
  // Match View Model
  //----------------------------------------------------------

  const match =
    mapMatchToViewModel(rawMatch);

  //----------------------------------------------------------
  // Football Intelligence
  //----------------------------------------------------------

  const intelligence =
    buildMatchIntelligence(rawMatch);

  //----------------------------------------------------------
  // Tactical Insights
  //----------------------------------------------------------

  const tacticalInsights =
    buildTacticalInsights(intelligence);

  //----------------------------------------------------------
  // Momentum Engine
  //----------------------------------------------------------

  const momentum =
    buildMatchMomentum(intelligence);

  //----------------------------------------------------------
  // Formation Engine
  //----------------------------------------------------------

  const formationShifts =
    buildFormationShifts(intelligence);

  //----------------------------------------------------------
  // AI Editorial Analysis
  //----------------------------------------------------------

  const report =
    buildMatchAnalysis({
      match,
      intelligence,
      tacticalInsights,
      momentum,
      formationShifts,
    });

  //----------------------------------------------------------
  // Placeholder Data
  //----------------------------------------------------------

  const timeline: TimelineEvent[] = [];

  const statistics: MatchStatistic[] = [];

  const playerRatings: PlayerRating[] = [];

  //----------------------------------------------------------
  // Response
  //----------------------------------------------------------

  return {
    match,
    rawMatch,
    intelligence,
    tacticalInsights,
    momentum,
    formationShifts,
    report,
    timeline,
    statistics,
    playerRatings,
    generatedAt: new Date().toISOString(),
  };
}