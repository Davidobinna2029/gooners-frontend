import type {
  MatchEvent,
} from "@/lib/football/advancedProvider";

import type {
  FootballEvent,
} from "@/src/lib/football/types";

export function adaptEvent(
  event: MatchEvent
): FootballEvent {

  return {

    id: event.id,

    minute: event.minute,

    extraMinute: event.extraMinute,

    playerId: undefined,

    playerName: event.player,

    assistPlayerName: event.assist,

    teamId: event.teamId,

    detail: event.detail,

    type: adaptEventType(event.type),

  };

}

function adaptEventType(
  type: MatchEvent["type"]
): FootballEvent["type"] {

  switch (type) {

    case "Goal":
      return "goal";

    case "Own Goal":
      return "own_goal";

    case "Penalty":
      return "penalty_goal";

    case "Missed Penalty":
      return "penalty_miss";

    case "Yellow Card":
      return "yellow_card";

    case "Red Card":
      return "red_card";

    case "Substitution":
      return "substitution";

    case "VAR":
      return "var";

    case "Injury":
      return "injury";

    default:
      return "shot";

  }

}