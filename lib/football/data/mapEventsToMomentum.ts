// lib/football/data/mapEventsToMomentum.ts

import type { NormalizedEvent } from "@/lib/football/data/types";

import type {
  MatchMomentEvent,
  MatchEventType,
} from "@/lib/football/types/matchEvents";

/* ==========================================================
   PROVIDER-AGNOSTIC
========================================================== */

function classifyEventType(
  event: NormalizedEvent
): MatchEventType | null {

  if (event.type === "Goal") {
    return "goal";
  }

  if (event.type === "Card") {

    const detail = (event.detail ?? "").toLowerCase();

    if (
      detail.includes("red") ||
      detail.includes("second yellow")
    ) {
      return "red_card";
    }

    if (detail.includes("yellow")) {
      return "yellow_card";
    }

    return null;
  }

  if (event.type === "subst") {
    return "substitution";
  }

  if (event.type === "Var") {
    return "var";
  }

  return null;
}

/* ==========================================================
   PUBLIC API
========================================================== */

export function mapNormalizedEventsToMomentum(
  events: NormalizedEvent[]
): MatchMomentEvent[] {

  return events
    .map((event) => {

      const type = classifyEventType(event);

      if (!type) return null;

      return {
        minute: event.minute,
        team: event.team,
        type,
      } satisfies MatchMomentEvent;

    })
    .filter(
      (event): event is MatchMomentEvent => event !== null
    );

}