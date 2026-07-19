// src/lib/football/match/matchCache.ts

import { unstable_cache } from "next/cache";

import {
  getMatchCentreData,
} from "./getMatchCentreData";


/**
 * Cache Match Centre data.
 *
 * Default lifetime:
 * 30 seconds.
 *
 * During live matches we can later
 * shorten this to 5–10 seconds.
 */
export const getCachedMatchCentreData =
  unstable_cache(

    async (
      matchId: number,
      homeTeamId: number,
      awayTeamId: number
    ) => {

      return getMatchCentreData(
        matchId,
        homeTeamId,
        awayTeamId
      );

    },

    /**
     * Cache key.
     */
    ["match-centre"],

    {
      revalidate: 30,

      tags: ["match-centre"],
    }

  );