// components/match/MatchEvents.tsx

import type { MatchEvent } from "@/lib/match/types";

import { FootballEventCard } from "@/src/design-system";

interface MatchEventsProps {
  events: MatchEvent[];
}

export default function MatchEvents({
  events,
}: MatchEventsProps) {
  if (!events.length) return null;

  const latestEvents = events
    .slice(-5)
    .reverse();

  return (
    <section className="py-4">
      <div className="space-y-3">
        {latestEvents.map((event) => (
          <FootballEventCard
            key={event.id}
            minute={`${event.minute}'`}
            eventType={event.type}
            player={event.player}
          />
        ))}
      </div>
    </section>
  );
}