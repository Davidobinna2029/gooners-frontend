// lib/football/validation/validateMatchPipeline.ts

import { loadMatchData } from "@/lib/football/data/loadMatchData";
import { mapMatchToViewModel } from "@/lib/football/mappers/mapMatchToViewModel";
import { mapNormalizedEventsToMomentum } from "@/lib/football/data/mapEventsToMomentum";

import { buildMatchIntelligence } from "@/lib/football/intelligence/matchIntelligence";
import { buildMatchMomentum } from "@/lib/football/intelligence/momentumEngine";
import { buildFormationShifts } from "@/lib/football/intelligence/formationShiftEngine";
import { buildTacticalInsights } from "@/lib/football/intelligence/tacticalInsights";
import { buildPlayerRankings } from "@/lib/football/intelligence/player";

import { buildMatchAnalysis } from "@/lib/football/ai/matchAnalysisEngine";
import { buildPlayerAwards } from "@/lib/football/ai/playerAwardsEngine";

import type { ValidationReport } from "./validationReport";
import { createEmptyReport, recordStage, recordError } from "./validationReport";

const TACTICAL_CATEGORIES = ["attacking", "defending", "transition", "possession"] as const;

/**
 * Runs the entire intelligence pipeline for one fixture and
 * returns a stage-by-stage report of every intermediate output.
 *
 * This proves the pipeline runs end-to-end against a real fixture
 * without throwing — it does NOT prove the football analysis is
 * correct. "Is this possession % believable, does this headline
 * match what happened, is Man of the Match a defensible pick" all
 * need a human reading the printed report and comparing it to the
 * real match (see docs/football-validation.md Phase 3/4).
 */
export async function validateMatchPipeline(
  fixtureId: string | number
): Promise<ValidationReport> {

  const report = createEmptyReport(fixtureId);

  try {

    const rawMatch = await loadMatchData(fixtureId);

    recordStage(report, "loadMatchData", {
      homeTeam: rawMatch.match.homeTeam.name,
      awayTeam: rawMatch.match.awayTeam.name,
      status: rawMatch.match.status,
      score: rawMatch.match.score,
      eventCount: rawMatch.events.length,
      playerCount: rawMatch.players?.length ?? 0,
      hasHomeLineup: Boolean(rawMatch.homeLineup),
      hasAwayLineup: Boolean(rawMatch.awayLineup),
    });

    const match = mapMatchToViewModel(rawMatch);

    recordStage(report, "mapMatchToViewModel", match);

    const intelligence = buildMatchIntelligence(rawMatch);

    recordStage(report, "buildMatchIntelligence", {
      confidence: intelligence.confidence,
      possession: {
        home: intelligence.home.dominance.possessionValue,
        away: intelligence.away.dominance.possessionValue,
      },
      controlIndex: {
        home: intelligence.home.dominance.controlIndex,
        away: intelligence.away.dominance.controlIndex,
      },
      fieldTilt: {
        home: intelligence.home.dominance.fieldTilt,
        away: intelligence.away.dominance.fieldTilt,
      },
      dangerousAttacks: {
        home: intelligence.home.dominance.dangerousAttacks,
        away: intelligence.away.dominance.dangerousAttacks,
      },
      PPDA: {
        home: intelligence.home.defending.PPDA,
        away: intelligence.away.defending.PPDA,
      },
      homePlayerCount: intelligence.home.players.length,
      awayPlayerCount: intelligence.away.players.length,
    });

    const momentumEvents = mapNormalizedEventsToMomentum(rawMatch.events);

    const momentum = buildMatchMomentum(intelligence, momentumEvents);

    recordStage(report, "buildMatchMomentum", {
      confidence: momentum.confidence,
      overallWinner: momentum.overallWinner,
      eventsUsed: momentumEvents.length,
      swings: momentum.swings,
      pressureWaves: momentum.pressureWaves.map(wave => ({
        team: wave.team,
        window: `${wave.minuteStart}-${wave.minuteEnd}'`,
        level: wave.level,
      })),
      timeline: momentum.timeline.map(window => ({
        window: `${window.minuteStart}-${window.minuteEnd}'`,
        dominantTeam: window.dominantTeam,
        intensity: window.intensity,
      })),
    });

    const formationShifts = buildFormationShifts(intelligence);

    recordStage(report, "buildFormationShifts", {
      shifts: [...formationShifts.home, ...formationShifts.away]
        .sort((a, b) => a.minute - b.minute)
        .map(shift => `${shift.minute}' [${shift.team}] ${shift.fromFormation} -> ${shift.toFormation}: ${shift.reason}`),
    });

    const tacticalInsights = buildTacticalInsights(intelligence, momentum);

    recordStage(report, "buildTacticalInsights", {
      home: Object.fromEntries(
        TACTICAL_CATEGORIES.map(category => [
          category,
          tacticalInsights.home[category].map(insight => insight.title),
        ])
      ),
      away: Object.fromEntries(
        TACTICAL_CATEGORIES.map(category => [
          category,
          tacticalInsights.away[category].map(insight => insight.title),
        ])
      ),
    });

    const playerRankings = buildPlayerRankings([
      ...intelligence.home.players,
      ...intelligence.away.players,
    ]);

    recordStage(
      report,
      "buildPlayerRankings",
      Object.fromEntries(
        Object.entries(playerRankings).map(([category, player]) => [
          category,
          player ? `${player.playerName} (${player.rating ?? "unrated"})` : undefined,
        ])
      )
    );

    const playerAwards = buildPlayerAwards(playerRankings);

    recordStage(
      report,
      "buildPlayerAwards",
      playerAwards.map(award => `${award.title}: ${award.description}`)
    );

    const analysis = buildMatchAnalysis({
      match,
      intelligence,
      tacticalInsights,
      momentum,
      formationShifts,
      playerRankings,
    });

    recordStage(report, "buildMatchAnalysis", analysis);

    report.success = true;

  } catch (error) {
    recordError(report, error);
  }

  return report;

}