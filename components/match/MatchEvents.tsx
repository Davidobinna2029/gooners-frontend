// components/match/MatchEvents.tsx

import type { MatchEvent } from "@/lib/match/types";

interface MatchEventsProps {
  events: MatchEvent[];
}

function getEventIcon(type: MatchEvent["type"]) {
  switch (type) {
    case "Goal":
    case "Penalty":
      return "⚽";

    case "Yellow Card":
      return "🟨";

    case "Red Card":
      return "🟥";

    case "Substitution":
      return "🔄";

    case "VAR":
      return "📺";

    default:
      return "•";
  }
}

export default function MatchEvents({
  events,
}: MatchEventsProps) {
  if (!events.length) return null;

  const latestEvents = events.slice(-5).reverse();

  return (
    <section className="border-t border-gray-200 py-4">
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
        Match Events
      </h4>

      <div className="space-y-2">
        {latestEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span>{getEventIcon(event.type)}</span>

              <span>{event.player}</span>
            </div>

            <span className="font-medium text-gray-500">
              {event.minute}'
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}