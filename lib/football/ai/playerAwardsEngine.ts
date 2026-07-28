// lib/football/ai/playerAwardsEngine.ts

import type { PlayerInsight } from "@/lib/football/intelligence/matchIntelligence";
import type { PlayerRankings } from "@/lib/football/intelligence/player";

/* ==========================================================
   PLAYER AWARD

   Built on top of player/ranking/playerRankingEngine.ts's
   PlayerRankings rather than re-detecting anything — this file's
   only job is turning an already-computed ranking into editorial
   text, the same "detection vs. narrative" split used throughout
   this codebase (e.g. tacticalInsights vs. matchAnalysisEngine).
========================================================== */

export interface PlayerAward {
  id: keyof PlayerRankings;
  title: string;
  player: PlayerInsight;
  description: string;
}

/* ==========================================================
   DESCRIPTIONS

   Every sentence below only references fields that actually exist
   on PlayerInsight (no xG/xA/progression — those were removed
   project-wide since no data source provides them). rating is
   optional throughout, so every description that uses it handles
   the undefined case explicitly rather than printing "undefined."
========================================================== */

function describeManOfTheMatch(player: PlayerInsight): string {
  const ratingClause =
    player.rating !== undefined
      ? `rated ${player.rating}`
      : "the standout performance";

  return `${player.playerName} was the standout performer, ${ratingClause} across ${player.minutesPlayed} minutes.`;
}

function describeBestAttacker(player: PlayerInsight): string {
  return `${player.playerName} led the line, scoring ${player.goals} and forcing ${player.shotsOnTarget} shot${player.shotsOnTarget === 1 ? "" : "s"} on target.`;
}

function describeBestCreator(player: PlayerInsight): string {
  return `${player.playerName} pulled the strings creatively, picking out ${player.keyPasses} key pass${player.keyPasses === 1 ? "" : "es"} and registering ${player.assists} assist${player.assists === 1 ? "" : "s"}.`;
}

function describeBestDefender(player: PlayerInsight): string {
  return `${player.playerName} was a rock at the back, making ${player.tackles} tackle${player.tackles === 1 ? "" : "s"} and ${player.interceptions} interception${player.interceptions === 1 ? "" : "s"}.`;
}

function describeBestPasser(player: PlayerInsight): string {
  return `${player.playerName} dictated the tempo, completing ${player.passesCompleted}/${player.passesAttempted} passes at ${player.passAccuracy}% accuracy.`;
}

function describeBiggestThreat(player: PlayerInsight): string {
  return `${player.playerName} was a constant menace, forcing ${player.shotsOnTarget} shot${player.shotsOnTarget === 1 ? "" : "s"} on target and beating defenders ${player.dribblesSuccessful} time${player.dribblesSuccessful === 1 ? "" : "s"}.`;
}

function describeSurprisePerformer(player: PlayerInsight): string {
  // Matches the honesty caveat already documented in
  // detectSurprisePerformer.ts — there's no starting-XI/reputation
  // data to measure a genuine surprise, so this deliberately stays
  // vague rather than claiming something unverifiable.
  return `${player.playerName} caught the eye with a strong all-round showing.`;
}

function describeUnderperformer(player: PlayerInsight): string {
  const ratingClause =
    player.rating !== undefined ? ` rated just ${player.rating}` : "";

  return `${player.playerName} had a difficult afternoon${ratingClause}.`;
}

/* ==========================================================
   AWARD DEFINITIONS
========================================================== */

const AWARD_DEFINITIONS: Array<{
  id: keyof PlayerRankings;
  title: string;
  describe: (player: PlayerInsight) => string;
}> = [
  { id: "manOfTheMatch", title: "Man of the Match", describe: describeManOfTheMatch },
  { id: "bestAttacker", title: "Best Attacker", describe: describeBestAttacker },
  { id: "bestCreator", title: "Best Creator", describe: describeBestCreator },
  { id: "bestDefender", title: "Best Defender", describe: describeBestDefender },
  { id: "bestPasser", title: "Best Passer", describe: describeBestPasser },
  { id: "biggestThreat", title: "Biggest Threat", describe: describeBiggestThreat },
  { id: "surprisePerformer", title: "Surprise Performer", describe: describeSurprisePerformer },
  { id: "underperformer", title: "Underperformer", describe: describeUnderperformer },
];

/* ==========================================================
   PUBLIC API
========================================================== */

export function buildPlayerAwards(
  rankings: PlayerRankings
): PlayerAward[] {

  const awards: PlayerAward[] = [];

  for (const definition of AWARD_DEFINITIONS) {

    const player = rankings[definition.id];

    if (!player) {
      continue;
    }

    awards.push({
      id: definition.id,
      title: definition.title,
      player,
      description: definition.describe(player),
    });

  }

  return awards;

}