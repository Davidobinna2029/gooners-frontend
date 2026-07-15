// lib/football/providers/apiFootball/advanced/eventMapper.ts

import type {
  MatchEvent,
} from "../../../advancedProvider";

export function mapApiFootballEvents(
  events: any[]
): MatchEvent[] {
  return events.map((event) => ({
    id:
      event.time.elapsed * 1000 +
      (event.player?.id ?? 0),

    minute:
      event.time.elapsed,

    extraMinute:
      event.time.extra ?? undefined,

    teamId:
      event.team.id,

    player:
      event.player?.name,

    assist:
      event.assist?.name,

    type:
      mapEventType(
        event.type,
        event.detail
      ),

    detail:
      event.detail,
  }));
}

function mapEventType(
  type: string,
  detail: string
): MatchEvent["type"] {
  switch (type) {
    case "Goal":
      if (
        detail === "Own Goal"
      ) {
        return "Own Goal";
      }

      if (
        detail === "Penalty"
      ) {
        return "Penalty";
      }

      return "Goal";

    case "Card":
      if (
        detail === "Yellow Card"
      ) {
        return "Yellow Card";
      }

      return "Red Card";

    case "subst":
      return "Substitution";

    case "Var":
      return "VAR";

    default:
      return "Other";
  }
}