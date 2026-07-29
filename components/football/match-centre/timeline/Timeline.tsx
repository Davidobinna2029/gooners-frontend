import TimelineItem from "./TimelineItem";
import TimelineFilters from "./TimelineFilters";

import {
  sortTimeline,
} from "./timeline.utils";

import type {
  TimelineEvent,
} from "./timeline.types";

interface Props {
  events: TimelineEvent[];
}

export default function Timeline({
  events,
}: Props) {
  const sorted =
    sortTimeline(events);

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">
        Match Timeline
      </h2>

      <TimelineFilters />

      <div>

        {sorted.length === 0 ? (
          <p className="text-gray-500">
            Timeline unavailable.
          </p>
        ) : (
          sorted.map(event => (
            <TimelineItem
              key={event.id}
              event={event}
            />
          ))
        )}

      </div>

    </section>
  );
}