// lib/api/liveMatches.ts

import { cached } from "@/lib/api/core/liveCache";

import { fetchESPNMatches }
  from "./providers/espnLiveProvider";

import { mapEspnMatches }
  from "@/lib/mappers/espnMatchMapper";

import { LiveMatchState }
  from "@/types/liveMatch";

export async function getLiveMatches(): Promise<
  LiveMatchState[]
> {
  return cached(async () => {
    try {
      const data =
        await fetchESPNMatches();

      if (
        !data ||
        typeof data !== "object"
      ) {
        return [];
      }

      /**
       * ESPN scoreboard events
       */
      const events =
        data?.events || [];

      const matches =
        mapEspnMatches(events);

      if (
        !Array.isArray(matches)
      ) {
        return [];
      }

      return matches;

    } catch (err) {
      console.error(
        "LiveMatches service failed:",
        err
      );

      return [];
    }
  });
}