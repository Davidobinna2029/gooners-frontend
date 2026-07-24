// src/lib/football/data/loadMatchData.ts

import {
  getMatch,
} from "./footballDataClient";

import {
  normalizeMatch,
} from "./normalizeMatch";

import type {
  MatchData,
} from "./types";

/* ==========================================================
   LOAD MATCH DATA
========================================================== */

export async function loadMatchData(
  matchId: string | number
): Promise<MatchData> {

  try {

    const rawMatch =
      await getMatch(Number(matchId));

    const normalized =
      normalizeMatch(rawMatch);

    return normalized;

  } catch (error) {

    console.error(
      "[loadMatchData]",
      error
    );

    throw new Error(
      "Unable to load match data."
    );

  }

}