import type {
  PlayerRankings,
} from "@/lib/football/intelligence/player/ranking/types";

export interface PlayerRatingsViewModel {

  manOfTheMatch?: PlayerRankings["manOfTheMatch"];

  bestAttacker?: PlayerRankings["bestAttacker"];

  bestCreator?: PlayerRankings["bestCreator"];

  bestDefender?: PlayerRankings["bestDefender"];

  bestPasser?: PlayerRankings["bestPasser"];

  biggestThreat?: PlayerRankings["biggestThreat"];

  surprisePerformer?: PlayerRankings["surprisePerformer"];

  underperformer?: PlayerRankings["underperformer"];

}

export function mapPlayerRatings(
  rankings: PlayerRankings
): PlayerRatingsViewModel {

  return {

    manOfTheMatch: rankings.manOfTheMatch,

    bestAttacker: rankings.bestAttacker,

    bestCreator: rankings.bestCreator,

    bestDefender: rankings.bestDefender,

    bestPasser: rankings.bestPasser,

    biggestThreat: rankings.biggestThreat,

    surprisePerformer: rankings.surprisePerformer,

    underperformer: rankings.underperformer,

  };

}