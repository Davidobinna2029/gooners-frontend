// components/sports/MatchClock.tsx

import type { Match } from "@/lib/football/types/match";

import { getLiveStatus } from "@/lib/football/live/status";

interface Props {
  match: Match;
}

export default function MatchClock({
  match,
}: Props) {
  const status =
    getLiveStatus(match);

  switch (status) {
    case "live":
      return (
        <span className="font-semibold text-red-600">
          🔴 LIVE
        </span>
      );

    case "halftime":
      return (
        <span className="font-semibold">
          HT
        </span>
      );

    case "extra-time":
      return (
        <span className="font-semibold text-orange-600">
          ET
        </span>
      );

    case "penalties":
      return (
        <span className="font-semibold text-purple-600">
          PEN
        </span>
      );

    case "finished":
      return (
        <span className="font-semibold">
          FT
        </span>
      );

    case "postponed":
      return (
        <span className="font-semibold">
          POSTPONED
        </span>
      );

    case "cancelled":
      return (
        <span className="font-semibold">
          CANCELLED
        </span>
      );

    default:
      return (
        <time dateTime={match.kickoff}>
          {new Date(
            match.kickoff
          ).toLocaleString(undefined, {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      );
  }
}