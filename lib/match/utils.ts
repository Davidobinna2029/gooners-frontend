// lib/match/utils.ts

import type { Match } from "./types";

export function formatScore(match: Match): string {
  return `${match.score.home} - ${match.score.away}`;
}

export function formatMinute(match: Match): string {
  if (!match.minute) return "";

  return `${match.minute}'`;
}

export function getStatusLabel(match: Match): string {
  switch (match.status) {
    case "LIVE":
      return match.minute ? `${match.minute}'` : "LIVE";

    case "HT":
      return "HT";

    case "FT":
      return "FT";

    case "AET":
      return "AET";

    case "PEN":
      return "PEN";

    case "NS":
      return new Date(match.kickoff).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    default:
      return match.status;
  }
}

export function formatKickoff(match: Match): string {
  return new Date(match.kickoff).toLocaleString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}