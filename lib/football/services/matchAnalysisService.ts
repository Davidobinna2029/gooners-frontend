// ==========================================================
// Match Analysis Service
// Central Football Intelligence Orchestrator
// ArsenalTalks
// ==========================================================

import { loadMatchData } from "@/lib/football/data/loadMatchData";
import { mapMatchToViewModel } from "@/lib/football/mappers/mapMatchToViewModel";
import { mapNormalizedEventsToMomentum } from "@/lib/football/data/mapEventsToMomentum";

import {
  buildMatchIntelligence,
} from "@/lib/football/intelligence/matchIntelligence";

import {
  buildTacticalInsights,
} from "@/lib/football/intelligence/tacticalInsights";

import {
  buildMatchMomentum,
} from "@/lib/football/intelligence/momentumEngine";

import {
  buildFormationShifts,
} from "@/lib/football/intelligence/formationShiftEngine";

import {
  buildPlayerRankings,
} from "@/lib/football/intelligence/player";

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
  MatchTacticalInsights,
} from "@/lib/football/intelligence/tacticalInsights";

import type {
  MatchMomentum,
} from "@/lib/football/intelligence/momentumEngine";

import type {
  MatchFormations,
} from "@/lib/football/intelligence/formationShiftEngine";

import type {
  PlayerRankings,
} from "@/lib/football/intelligence/player";

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
  tacticalInsights: MatchTacticalInsights;

  /**
   * Momentum Engine
   */
  momentum: MatchMomentum;

  /**
   * Formation Engine
   */
  formationShifts: MatchFormations;

  /**
   * Player Rankings (Man of the Match, Best Defender, etc.)
   */
  playerRankings: PlayerRankings;

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
  // Momentum Engine
  // (must run before Tactical Insights — detectMatchControl
  // depends on the momentum verdict)
  //----------------------------------------------------------

  const momentumEvents =
    mapNormalizedEventsToMomentum(rawMatch.events);

  const momentum =
    buildMatchMomentum(intelligence, momentumEvents);

  //----------------------------------------------------------
  // Tactical Insights
  //----------------------------------------------------------

  const tacticalInsights =
    buildTacticalInsights(intelligence, momentum);

  //----------------------------------------------------------
  // Formation Engine
  //----------------------------------------------------------

  const formationShifts =
    buildFormationShifts(intelligence);

  //----------------------------------------------------------
  // Player Rankings
  // (match-wide superlatives — combines both teams' players,
  // since Man of the Match etc. aren't per-team concepts)
  //----------------------------------------------------------

  const playerRankings =
    buildPlayerRankings([
      ...intelligence.home.players,
      ...intelligence.away.players,
    ]);

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
      playerRankings,
    });

  //----------------------------------------------------------
  // Player Ratings
  // (flat per-player list, distinct from playerRankings'
  // superlatives — every rated player, not just the standouts)
  //----------------------------------------------------------

  const playerRatings: PlayerRating[] = [
    ...intelligence.home.players,
    ...intelligence.away.players,
  ]
    .filter(player => player.rating !== undefined)
    .map(player => ({
      playerId: String(player.playerId),
      playerName: player.playerName,
      team: player.team,
      rating: player.rating as number,
    }));

  //----------------------------------------------------------
  // Placeholder Data
  //----------------------------------------------------------

  const timeline: TimelineEvent[] = [];

  const statistics: MatchStatistic[] = [];

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
    playerRankings,
    report,
    timeline,
    statistics,
    playerRatings,
    generatedAt: new Date().toISOString(),
  };
}