import type { TimelineEvent } from "@/components/football/match-centre/timeline";
import type { NormalizedEvent } from "@/lib/football/data/types";

function mapEventType(
  type: string
): TimelineEvent["type"] {

  switch (type.toLowerCase()) {

    case "goal":
      return "goal";

    case "own goal":
      return "own_goal";

    case "penalty":
      return "penalty_goal";

    case "missed penalty":
      return "penalty_miss";

    case "yellow card":
      return "yellow_card";

    case "red card":
      return "red_card";

    case "second yellow":
      return "second_yellow";

    case "substitution":
    case "subst":
      return "substitution";

    case "injury":
      return "injury";

    case "kickoff":
      return "kickoff";

    case "half":
      return "half_time";

    case "fulltime":
      return "full_time";

    case "var":
      return "var";

    default:
      return "var";

  }

}

export function mapEventsToTimeline(
  events: NormalizedEvent[]
): TimelineEvent[] {

  return events.map((event, index) => ({

    // NormalizedEvent has no id, so generate one.
    id: `${event.minute}-${event.team}-${index}`,

    minute: event.minute,

    team: event.team,

    type: mapEventType(event.type),

    title: event.type,

    description: event.detail,

    player: event.player
      ? {
          name: event.player,
        }
      : undefined,

    relatedPlayer: event.assist
      ? {
          name: event.assist,
        }
      : undefined,

    important: false,

  }));

}