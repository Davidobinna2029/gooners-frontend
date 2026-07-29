import type {
  TimelineEvent,
} from "./timeline.types";

export function formatMinute(
  event: TimelineEvent
) {
  if (event.extraMinute) {
    return `${event.minute}+${event.extraMinute}'`;
  }

  return `${event.minute}'`;
}

export function sortTimeline(
  events: TimelineEvent[]
) {
  return [...events].sort((a, b) => {
    const minuteA =
      a.minute + (a.extraMinute ?? 0) / 100;

    const minuteB =
      b.minute + (b.extraMinute ?? 0) / 100;

    return minuteB - minuteA;
  });
}