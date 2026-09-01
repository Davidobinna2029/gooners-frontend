// ==========================================================
// Match Analysis Service
// Central Football Intelligence Orchestrator
// ArsenalTalks
// ==========================================================

import { loadMatchData } from "@/lib/football/data/loadMatchData";
import { mapMatchToViewModel } from "@/lib/football/mappers/mapMatchToViewModel";
import { mapNormalizedEventsToMomentum } from "@/lib/football/data/mapEventsToMomentum";
import { mapEventsToTimeline } from "@/lib/football/mappers/mapEventsToTimeline";

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
  generateMatchReport,
} from "@/lib/football/ai/generateMatchReport";

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
} from "@/lib/football/types/matchEvents";

import type {
  MatchFormations,
} from "@/lib/football/intelligence/formationShiftEngine";

import type {
  PlayerRankings,
} from "@/lib/football/intelligence/player";

import type {
  MatchAnalysis,
} from "@/lib/football/ai/matchAnalysisEngine";

import type {
  TimelineEvent,
} from "@/components/football/match-centre/timeline";

/* ==========================================================
   Future Types
========================================================== */

export interface MatchStatistic {
  label: string;
  home: number | string;
  away: number | string;
}

export interface PlayerRating {
  playerId: string;
  playerName: string;
  team: "home" | "away";
  rating: number;
}

/* ==========================================================
   Public Response
========================================================== */

export interface MatchAnalysisResponse {
  match: MatchViewModel;

  rawMatch: unknown;

  intelligence: MatchIntelligence;

  tacticalInsights: MatchTacticalInsights;

  momentum: MatchMomentum;

  formationShifts: MatchFormations;

  playerRankings: PlayerRankings;

  report: MatchAnalysis;

  timeline: TimelineEvent[];

  statistics: MatchStatistic[];

  playerRatings: PlayerRating[];

  generatedAt: string;
}

/* ==========================================================
   Service
========================================================== */

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
  // Match Intelligence
  //----------------------------------------------------------

  const intelligence =
    buildMatchIntelligence(rawMatch);

  //----------------------------------------------------------
  // Momentum
  //----------------------------------------------------------

  const momentumEvents =
    mapNormalizedEventsToMomentum(rawMatch.events);

  const momentum =
    buildMatchMomentum(
      intelligence,
      momentumEvents
    );

  //----------------------------------------------------------
  // Tactical Insights
  //----------------------------------------------------------

  const tacticalInsights =
    buildTacticalInsights(
      intelligence,
      momentum
    );

  //----------------------------------------------------------
  // Formation Shifts
  //----------------------------------------------------------

  const formationShifts =
    buildFormationShifts(
      intelligence
    );

  //----------------------------------------------------------
  // Player Rankings
  //----------------------------------------------------------

  const playerRankings =
    buildPlayerRankings([
      ...intelligence.home.players,
      ...intelligence.away.players,
    ]);

  //----------------------------------------------------------
  // Editorial Match Analysis
  //----------------------------------------------------------

  const report = await generateMatchReport({
    match,
    intelligence,
    momentum,
    formationShifts,
    tacticalInsights,
    playerRankings,
  });

  //----------------------------------------------------------
  // Timeline
  //----------------------------------------------------------

  const timeline =
    mapEventsToTimeline(
      rawMatch.events
    );

  //----------------------------------------------------------
  // Player Ratings
  //----------------------------------------------------------

  const playerRatings: PlayerRating[] =
    [
      ...intelligence.home.players,
      ...intelligence.away.players,
    ]
      .filter(
        (player) =>
          player.rating !== undefined
      )
      .map((player) => ({
        playerId: String(player.playerId),
        playerName: player.playerName,
        team: player.team,
        rating: player.rating as number,
      }));

  //----------------------------------------------------------
  // Statistics
  //----------------------------------------------------------

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
    generatedAt:
      new Date().toISOString(),
  };

}