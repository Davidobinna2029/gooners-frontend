export type MatchEventType =
  | "goal"
  | "own_goal"
  | "penalty_goal"
  | "penalty_miss"
  | "yellow_card"
  | "red_card"
  | "substitution"
  | "shot"
  | "shot_on_target"
  | "big_chance"
  | "corner"
  | "var"
  | "injury";

export interface MatchEvent {
  id: string;
  minute: number;
  addedTime?: number;
  team: "home" | "away";
  type: MatchEventType;
  player?: string;
  assist?: string;
  description: string;
}

export interface MatchEvents {
  generatedAt: string;
  events: MatchEvent[];

  goals: MatchEvent[];
  cards: MatchEvent[];
  substitutions: MatchEvent[];
  varEvents: MatchEvent[];
}

export function buildMatchEvents(
  rawEvents: MatchEvent[]
): MatchEvents {
  const events = [...rawEvents].sort((a, b) => {
    const aTime = a.minute * 100 + (a.addedTime ?? 0);
    const bTime = b.minute * 100 + (b.addedTime ?? 0);
    return aTime - bTime;
  });

  return {
    generatedAt: new Date().toISOString(),
    events,
    goals: events.filter(e =>
      ["goal", "own_goal", "penalty_goal"].includes(e.type)
    ),
    cards: events.filter(e =>
      ["yellow_card", "red_card"].includes(e.type)
    ),
    substitutions: events.filter(e => e.type === "substitution"),
    varEvents: events.filter(e => e.type === "var"),
  };
}