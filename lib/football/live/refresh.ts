// lib/football/live/refresh.ts

import type { Match } from "../types/match";
import { getLiveStatus } from "./status";

/**
 * Returns the polling interval (milliseconds)
 * for a match based on its current state.
 */

export function getRefreshInterval(
  match: Match
): number {
  const status =
    getLiveStatus(match);

  switch (status) {
    case "live":
      return 15_000;

    case "halftime":
      return 60_000;

    case "extra-time":
      return 10_000;

    case "penalties":
      return 5_000;

    case "scheduled":
      return 300_000;

    case "finished":
    case "cancelled":
    case "postponed":
      return 0;

    default:
      return 300_000;
  }
}

/**
 * Whether the UI should continue polling.
 */

export function shouldRefresh(
  match: Match
): boolean {
  return (
    getRefreshInterval(match) > 0
  );
}

/**
 * Whether this match should be treated
 * as a live match.
 */

export function isLiveMatch(
  match: Match
): boolean {
  const status =
    getLiveStatus(match);

  return (
    status === "live" ||
    status === "extra-time" ||
    status === "penalties"
  );
}