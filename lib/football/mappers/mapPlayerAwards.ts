// lib/football/mappers/mapPlayerAwards.ts

import type {
  PlayerInsight,
} from "@/lib/football/intelligence/player/ranking/types";

import type {
  PlayerRatingsViewModel,
} from "@/lib/football/mappers/mapPlayerRatings";


/* ==========================================================
   PLAYER AWARD TYPES
========================================================== */

export type PlayerAwardType =
  | "MAN_OF_THE_MATCH"
  | "BEST_ATTACKER"
  | "BEST_CREATOR"
  | "BEST_DEFENDER"
  | "BEST_PASSER"
  | "BIGGEST_THREAT"
  | "SURPRISE_PERFORMER"
  | "UNDERPERFORMER";


/* ==========================================================
   VIEW MODEL
========================================================== */

export interface PlayerAwardViewModel {

  type: PlayerAwardType;

  label: string;

  player: PlayerInsight;

}


/* ==========================================================
   LABELS
========================================================== */

const awardLabels: Record<
  PlayerAwardType,
  string
> = {

  MAN_OF_THE_MATCH:
    "Man of the Match",

  BEST_ATTACKER:
    "Best Attacker",

  BEST_CREATOR:
    "Best Creator",

  BEST_DEFENDER:
    "Best Defender",

  BEST_PASSER:
    "Best Passer",

  BIGGEST_THREAT:
    "Biggest Threat",

  SURPRISE_PERFORMER:
    "Surprise Performer",

  UNDERPERFORMER:
    "Underperformer",

};


/* ==========================================================
   MAPPER
========================================================== */

export function mapPlayerAwards(
  ratings: PlayerRatingsViewModel
): PlayerAwardViewModel[] {

  const awards: PlayerAwardViewModel[] = [];


  const addAward = (
    type: PlayerAwardType,
    player?: PlayerInsight
  ) => {

    if (!player) {
      return;
    }


    awards.push({

      type,

      label:
        awardLabels[type],

      player,

    });

  };


  addAward(
    "MAN_OF_THE_MATCH",
    ratings.manOfTheMatch
  );


  addAward(
    "BEST_ATTACKER",
    ratings.bestAttacker
  );


  addAward(
    "BEST_CREATOR",
    ratings.bestCreator
  );


  addAward(
    "BEST_DEFENDER",
    ratings.bestDefender
  );


  addAward(
    "BEST_PASSER",
    ratings.bestPasser
  );


  addAward(
    "BIGGEST_THREAT",
    ratings.biggestThreat
  );


  addAward(
    "SURPRISE_PERFORMER",
    ratings.surprisePerformer
  );


  addAward(
    "UNDERPERFORMER",
    ratings.underperformer
  );


  return awards;

}