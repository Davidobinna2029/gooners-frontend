import type {
  FootballEvent,
} from "@/src/lib/football/types";

import {
  calculateMomentum,
} from "@/src/lib/football/momentum/momentumEngine";

import {
  calculateExpectedGoals,
} from "@/src/lib/football/xg/xgEngine";

import {
  calculateTerritory,
} from "./territoryEngine";

interface WinProbability {

  homeWin: number;

  draw: number;

  awayWin: number;

}

export function calculateWinProbability(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number,

  homeGoals: number,

  awayGoals: number,

  minute: number

): WinProbability {

  const momentum =
    calculateMomentum(
      events,
      homeTeamId,
      awayTeamId
    );

  const xg =
    calculateExpectedGoals(
      events,
      homeTeamId,
      awayTeamId
    );

  const territory =
    calculateTerritory(
      events,
      homeTeamId,
      awayTeamId
    );

  let home = 33;
  let away = 33;
  let draw = 34;

  home +=
    (homeGoals - awayGoals) * 18;

  away +=
    (awayGoals - homeGoals) * 18;

  home +=
    (momentum.home - momentum.away) * 0.20;

  away +=
    (momentum.away - momentum.home) * 0.20;

  home +=
    (xg.home - xg.away) * 8;

  away +=
    (xg.away - xg.home) * 8;

  home +=
    (territory.home - territory.away) * 0.10;

  away +=
    (territory.away - territory.home) * 0.10;

  draw -=
    Math.abs(
      homeGoals - awayGoals
    ) * 10;

  draw -=
    Math.min(
      minute,
      90
    ) * 0.10;

  home =
    Math.max(
      0,
      home
    );

  away =
    Math.max(
      0,
      away
    );

  draw =
    Math.max(
      0,
      draw
    );

  const total =
    home + away + draw;

  return {

    homeWin:
      Math.round(
        (home / total) * 100
      ),

    draw:
      Math.round(
        (draw / total) * 100
      ),

    awayWin:
      Math.round(
        (away / total) * 100
      ),

  };

}