import TimelineEvent from "../shared/TimelineEvent";

interface TimelineItem {
  id: string;

  minute: string;

  icon: string;

  title: string;

  description?: string;
}

interface Props {
  events: TimelineItem[];
}

export default function MatchTimeline({
  events,
}: Props) {
  return (
    <div className="space-y-4">

      {events.map((event) => (

        <TimelineEvent
          key={event.id}
          minute={event.minute}
          icon={event.icon}
          title={event.title}
          description={event.description}
        />

      ))}

    </div>
  );
}