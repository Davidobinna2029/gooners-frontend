// lib/football/visualization/possessionMap.ts

import type { MatchIntelligence } from "@/lib/football/intelligence/matchIntelligence";

/* ==========================================================
   NAMING NOTE

   Despite the filename (kept to match the requested structure),
   this does NOT produce a spatial territory map — there's no
   positional/event data in MatchIntelligence to build one from.
   This produces a possession SHARE dataset: home vs away %,
   suitable for a bar or donut chart. Don't extend this file to
   pretend it's plotting pitch zones without real coordinate data
   backing it.
========================================================== */

export interface PossessionSharePoint {
  team: "home" | "away";
  teamName: string;
  /** 0-100 */
  possession: number;
}

export interface PossessionChartDataset {
  home: PossessionSharePoint;
  away: PossessionSharePoint;
  /** Percentage-point gap. Positive = home had more of the ball. */
  differential: number;
}

export function buildPossessionChart(
  intelligence: MatchIntelligence
): PossessionChartDataset {

  const home = intelligence.home.dominance.possessionValue;
  const away = intelligence.away.dominance.possessionValue;

  return {

    home: {
      team: "home",
      teamName: intelligence.home.information.name,
      possession: home,
    },

    away: {
      team: "away",
      teamName: intelligence.away.information.name,
      possession: away,
    },

    differential: home - away,

  };

}