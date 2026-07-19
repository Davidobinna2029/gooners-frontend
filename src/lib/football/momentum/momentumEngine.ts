// src/lib/football/momentum/momentumEngine.ts

import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface MomentumState {
  home: number;
  away: number;
}

/**
 * Calculates live match momentum from
 * football events.
 *
 * Starts both teams at 50 and shifts
 * momentum based on significant events.
 *
 * Range:
 * 0   = No pressure
 * 50  = Balanced match
 * 100 = Total domination
 */
export function calculateMomentum(
  events: FootballEvent[],
  homeTeamId: number,
  awayTeamId: number
): MomentumState {
  let home = 50;
  let away = 50;

  for (const event of events) {
    let weight = 0;

    switch (event.type) {
      case "goal":
      case "penalty_goal":
      case "own_goal":
        weight = 12;
        break;

      case "shot":
        weight = 5;
        break;

      case "save":
        weight = 4;
        break;

      case "corner":
        weight = 3;
        break;

      case "penalty_miss":
        weight = 6;
        break;

      case "yellow_card":
      case "second_yellow":
        weight = 2;
        break;

      case "red_card":
        weight = 8;
        break;

      case "substitution":
        weight = 1;
        break;

      case "offside":
        weight = 1;
        break;

      case "foul":
        weight = 1;
        break;

      case "var":
        weight = 2;
        break;

      case "injury":
        weight = 1;
        break;

      case "kickoff":
      case "halftime":
      case "fulltime":
      default:
        weight = 0;
        break;
    }

    if (!event.teamId || weight === 0) {
      continue;
    }

    if (event.teamId === homeTeamId) {
      home += weight;
      away -= weight * 0.5;
    } else if (event.teamId === awayTeamId) {
      away += weight;
      home -= weight * 0.5;
    }
  }

  home = Math.max(0, Math.min(100, home));
  away = Math.max(0, Math.min(100, away));

  return {
    home,
    away,
  };
}