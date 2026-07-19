import type {
  AnimationEvent,
} from "@/src/design-system/football/animation";

import type {
  QueuedAnimationEvent,
} from "./eventQueue";


export interface TimelineState {
  activeEvents: AnimationEvent[];

  started: boolean;
}


export function buildTimelineState(
  queue: QueuedAnimationEvent[],
  elapsedTime: number
): TimelineState {

  const activeEvents =
    queue
      .filter(
        (item) =>
          item.triggerAt <= elapsedTime
      )
      .map(
        (item) =>
          item.event
      );


  return {
    activeEvents,

    started: elapsedTime > 0,
  };
}