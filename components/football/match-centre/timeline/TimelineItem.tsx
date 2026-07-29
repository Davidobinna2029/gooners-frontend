import {
  formatMinute,
} from "./timeline.utils";

import type {
  TimelineEvent,
} from "./timeline.types";

interface Props {
  event: TimelineEvent;
}

const ICONS = {
  goal: "⚽",
  own_goal: "🥅",
  penalty_goal: "🎯",
  penalty_miss: "❌",
  yellow_card: "🟨",
  red_card: "🟥",
  second_yellow: "🟨🟥",
  substitution: "🔄",
  var: "📺",
  injury: "🩹",
  kickoff: "▶",
  half_time: "⏸",
  full_time: "🏁",
};

export default function TimelineItem({
  event,
}: Props) {
  return (
    <div className="flex gap-4 border-b py-4">

      <div className="w-16 text-right font-semibold text-gray-500">
        {formatMinute(event)}
      </div>

      <div className="text-2xl">
        {ICONS[event.type]}
      </div>

      <div className="flex-1">

        <h4 className="font-semibold">
          {event.title}
        </h4>

        {event.player && (
          <p className="text-sm text-gray-600">
            {event.player.name}
          </p>
        )}

        {event.description && (
          <p className="mt-1 text-sm text-gray-500">
            {event.description}
          </p>
        )}

      </div>

    </div>
  );
}