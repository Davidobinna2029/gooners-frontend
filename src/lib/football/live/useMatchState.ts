import { useMemo } from "react";

import type {
  NormalizedMatchEvent,
} from "@/src/lib/football/events";

import { MatchStateEngine } from "./stateEngine";

export function useMatchState(
  events: NormalizedMatchEvent[]
) {
  return useMemo(() => {
    const engine =
      new MatchStateEngine();

    events.forEach((event) => {
      if (!event.playerId) return;

      switch (event.type) {
        case "GOAL":
          engine.goal(event.playerId);
          break;

        case "YELLOW_CARD":
          engine.yellowCard(event.playerId);
          break;

        case "RED_CARD":
          engine.redCard(event.playerId);
          break;

        case "SUBSTITUTION":
          engine.substitution(event.playerId);
          break;
      }
    });

    return engine.state;
  }, [events]);
}