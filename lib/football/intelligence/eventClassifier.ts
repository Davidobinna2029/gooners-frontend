import type {
  MatchEvent,
  MatchEventType,
  MatchMomentEvent,
} from "@/lib/football/types/matchEvents";

/* ==========================================================
   RAW EVENT
   Replace this interface with your provider's event type later.
========================================================== */

export interface RawMatchEvent {
  id?: string | number;
  minute: number;
  extraMinute?: number;

  team: "home" | "away";

  type: string;
  detail?: string;

  player?: string;
  assist?: string;

  description?: string;
}

/* ==========================================================
   TYPE MAPPING
========================================================== */

const TYPE_MAP: Record<string, MatchEventType> = {
  Goal: "goal",
  "Own Goal": "own_goal",
  "Penalty Goal": "penalty_goal",
  "Penalty Miss": "penalty_miss",

  "Yellow Card": "yellow_card",
  "Red Card": "red_card",

  Substitution: "substitution",

  Shot: "shot_off_target",
  "Shot On Target": "shot_on_target",
  "Big Chance": "big_chance",

  Corner: "corner",

  VAR: "var",

  Injury: "injury",
};

/* ==========================================================
   DETAIL OVERRIDES
========================================================== */

function resolveType(
  event: RawMatchEvent
): MatchEventType {

  if (
    event.type === "Goal" &&
    event.detail === "Own Goal"
  ) {
    return "own_goal";
  }

  if (
    event.type === "Goal" &&
    event.detail === "Penalty"
  ) {
    return "penalty_goal";
  }

  if (
    event.type === "Missed Penalty"
  ) {
    return "penalty_miss";
  }

  return (
    TYPE_MAP[event.type] ??
    "shot"
  );

}

/* ==========================================================
   CLASSIFY ONE EVENT
========================================================== */

export function classifyEvent(
  raw: RawMatchEvent
): MatchEvent {

  return {

    id:
      String(
        raw.id ??
        `${raw.minute}-${raw.type}-${raw.player ?? "event"}`
      ),

    minute:
      raw.minute,

    addedTime:
      raw.extraMinute,

    team:
      raw.team,

    type:
      resolveType(raw),

    player:
      raw.player,

    assist:
      raw.assist,

    description:
      raw.description ??
      `${raw.type}${raw.player ? ` • ${raw.player}` : ""}`,

  };

}

/* ==========================================================
   CLASSIFY MANY EVENTS
========================================================== */

export function classifyEvents(
  rawEvents: RawMatchEvent[]
): MatchEvent[] {

  return rawEvents
    .map(classifyEvent)
    .sort((a, b) => {

      const aTime =
        a.minute * 100 +
        (a.addedTime ?? 0);

      const bTime =
        b.minute * 100 +
        (b.addedTime ?? 0);

      return aTime - bTime;

    });

}

/* ==========================================================
   MOMENTUM EVENTS
========================================================== */

export function classifyMomentumEvents(
  rawEvents: RawMatchEvent[]
): MatchMomentEvent[] {

  return classifyEvents(rawEvents).map(event => ({
    minute: event.minute,
    team: event.team,
    type: event.type,
  }));

}