// lib/football/data/mapEventsToMomentum.ts

import type { NormalizedEvent } from "@/lib/football/data/types";
import type {
  MatchMomentEvent,
  MomentumEventType,
} from "@/lib/football/intelligence/momentumEngine";

/* ==========================================================
   PROVIDER-AGNOSTIC

   This operates on NormalizedEvent (already stripped of any
   provider-specific shape), not raw provider JSON — unlike an
   earlier version of this file, which parsed API-Football's raw
   response directly and bypassed the normalization layer entirely.
   That was a layering bug: MatchData.events is supposed to be the
   single normalized representation everything downstream reads
   from, not something momentum re-derives from raw JSON on its own.

   The event-type classification below (Goal/Card/subst/Var) still
   reflects API-Football's specific vocabulary in `type`/`detail`,
   since that's what NormalizedEvent.type/detail actually carry
   through unchanged right now (NormalizedEvent doesn't define a
   fixed cross-provider vocabulary for these). If a second provider
   is added later with different type strings, this classification
   will need widening.
========================================================== */

function classifyEventType(event: NormalizedEvent): MomentumEventType | null {

  if (event.type === "Goal") {
    return "goal";
  }

  if (event.type === "Card") {
    const detail = (event.detail ?? "").toLowerCase();

    if (detail.includes("red") || detail.includes("second yellow")) {
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
    return "var_review";
  }

  return null;

}

/* ==========================================================
   LIMITATION (unchanged from the original version)

   No shot-by-shot data exists in any event feed seen so far —
   MomentumEventType's "shot_on_target"/"shot_off_target"/
   "big_chance" remain permanently unfillable without a
   coordinate-tracking provider.
========================================================== */

/* ==========================================================
   PUBLIC API
========================================================== */

export function mapNormalizedEventsToMomentum(
  events: NormalizedEvent[]
): MatchMomentEvent[] {

  const result: MatchMomentEvent[] = [];

  for (const event of events) {

    const momentumType = classifyEventType(event);

    if (!momentumType) {
      continue;
    }

    result.push({
      minute: event.minute,
      team: event.team,
      type: momentumType,
    });

  }

  return result;

}