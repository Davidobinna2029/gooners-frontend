// components/match/MatchTimeline.tsx

import type { Match } from "@/lib/football/types/match";
import type {
  MatchEvent,
} from "@/lib/football/advancedProvider";

import {
  FootballEventCard,
  FootballSection,
} from "@/src/design-system";

import EmptyState from "@/src/design-system/ui/EmptyState";

interface Props {
  match: Match;
  events: MatchEvent[];
}

export default function MatchTimeline({
  match,
  events,
}: Props) {
  if (!events.length) {
    return (
      <FootballSection title="Match Timeline">
        <EmptyState
          title="No Match Events"
          description="Timeline events are not available."
        />
      </FootballSection>
    );
  }

  return (
    <FootballSection title="Match Timeline">
      <div className="space-y-4">
        {events.map((event) => {
          const teamName =
            event.teamId === match.homeTeam.id
              ? match.homeTeam.name
              : event.teamId === match.awayTeam.id
                ? match.awayTeam.name
                : "Unknown Team";

          const minute = `${event.minute}${
            event.extraMinute
              ? `+${event.extraMinute}`
              : ""
          }'`;

          const detail = [
            event.assist
              ? `Assist: ${event.assist}`
              : null,
            event.detail,
          ]
            .filter(Boolean)
            .join(" • ");

          return (
            <FootballEventCard
              key={event.id}
              minute={minute}
              eventType={event.type}
              player={
                event.player ??
                "Unknown Player"
              }
              detail={
                detail || undefined
              }
              team={teamName}
            />
          );
        })}
      </div>
    </FootballSection>
  );
}