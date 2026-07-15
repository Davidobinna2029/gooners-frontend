// lib/football/live/status.ts

import type { Match } from "../types/match";

export type LiveStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "extra-time"
  | "penalties"
  | "finished"
  | "postponed"
  | "cancelled";

export function getLiveStatus(
  match: Match
): LiveStatus {
  switch (match.status) {
    case "SCHEDULED":
    case "TIMED":
      return "scheduled";

    case "LIVE":
    case "IN_PLAY":
      return "live";

    case "PAUSED":
    case "HALF_TIME":
      return "halftime";

    case "EXTRA_TIME":
      return "extra-time";

    case "PENALTY_SHOOTOUT":
      return "penalties";

    case "FINISHED":
      return "finished";

    case "POSTPONED":
      return "postponed";

    case "CANCELLED":
      return "cancelled";

    default:
      return "scheduled";
  }
}