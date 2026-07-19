// src/lib/football/live/matchDiff.ts

import type {
  FootballEvent,
} from "@/src/lib/football/types";

export type MatchDiffEventType =
  | "GOAL"
  | "YELLOW_CARD"
  | "RED_CARD"
  | "SUBSTITUTION"
  | "VAR"
  | "MATCH_STARTED"
  | "HALF_TIME"
  | "FULL_TIME";

export interface MatchDiffEvent {
  type: MatchDiffEventType;

  event: FootballEvent;
}

/**
 * Live visual state for a player.
 *
 * This state is consumed by the Football Pitch
 * to trigger animations and visual feedback.
 */
export interface PlayerLiveState {

  goal?: boolean;

  yellowCard?: boolean;

  redCard?: boolean;

  pulse?: boolean;

  rating?: number;

}

/**
 * Compares the previous match events against
 * the latest events and returns only the newly
 * added events as high-level actions for the
 * animation engine.
 */
export function diffEvents(
  previous: FootballEvent[],
  current: FootballEvent[]
): MatchDiffEvent[] {

  const previousIds = new Set(
    previous.map(
      (event) => event.id
    )
  );

  const newEvents =
    current.filter(
      (event) =>
        !previousIds.has(event.id)
    );

  return newEvents.map((event) => {

    switch (event.type) {

      case "goal":

      case "own_goal":

      case "penalty_goal":

        return {

          type: "GOAL",

          event,

        };

      case "yellow_card":

      case "second_yellow":

        return {

          type: "YELLOW_CARD",

          event,

        };

      case "red_card":

        return {

          type: "RED_CARD",

          event,

        };

      case "substitution":

        return {

          type: "SUBSTITUTION",

          event,

        };

      case "var":

        return {

          type: "VAR",

          event,

        };

      case "kickoff":

        return {

          type: "MATCH_STARTED",

          event,

        };

      case "halftime":

        return {

          type: "HALF_TIME",

          event,

        };

      case "fulltime":

        return {

          type: "FULL_TIME",

          event,

        };

      default:

        return {

          type: "MATCH_STARTED",

          event,

        };

    }

  });

}

/**
 * Converts newly detected match events into
 * live player visual states.
 *
 * Example:
 *
 * GOAL
 * ↓
 * {
 *   7: {
 *     goal: true,
 *     pulse: true
 *   }
 * }
 */
export function buildPlayerStates(
  events: MatchDiffEvent[]
): Record<number, PlayerLiveState> {

  const players: Record<
    number,
    PlayerLiveState
  > = {};

  for (const action of events) {

    const playerId =
      action.event.playerId;

    if (!playerId) {
      continue;
    }

    if (!players[playerId]) {

      players[playerId] = {};

    }

    switch (action.type) {

      case "GOAL":

        players[playerId].goal = true;

        players[playerId].pulse = true;

        break;

      case "YELLOW_CARD":

        players[playerId].yellowCard = true;

        players[playerId].pulse = true;

        break;

      case "RED_CARD":

        players[playerId].redCard = true;

        players[playerId].pulse = true;

        break;

      default:

        break;

    }

  }

  return players;

}