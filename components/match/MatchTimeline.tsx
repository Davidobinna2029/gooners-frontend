// components/match/MatchTimeline.tsx

import type { Match } from "@/lib/football/types/match";
import type {
  MatchEvent,
} from "@/lib/football/advancedProvider";

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
      <section className="match-timeline">
        <h3>
          Timeline
        </h3>

        <p>
          No match events available.
        </p>
      </section>
    );
  }

  return (
    <section className="match-timeline">

      <h3>
        Timeline
      </h3>

      <div className="timeline-events">

        {events.map((event) => {
          const teamName =
            event.teamId ===
            match.homeTeam.id
              ? match.homeTeam.name
              : event.teamId ===
                  match.awayTeam.id
                ? match.awayTeam.name
                : "Unknown Team";

          return (
            <article
              key={event.id}
              className="timeline-event"
            >

              <div className="timeline-minute">
                {event.minute}
                {event.extraMinute
                  ? `+${event.extraMinute}`
                  : ""}
                '
              </div>

              <div className="timeline-content">

                <strong>
                  {event.player ??
                    "Unknown Player"}
                </strong>

                {event.assist && (
                  <p>
                    Assist:{" "}
                    {event.assist}
                  </p>
                )}

                <p>
                  {event.type}
                </p>

                {event.detail && (
                  <small>
                    {event.detail}
                  </small>
                )}

              </div>

              <div className="timeline-team">
                {teamName}
              </div>

            </article>
          );
        })}

      </div>

    </section>
  );
}