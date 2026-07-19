import type {
  AnimationEvent,
} from "@/src/design-system/football/animation";


export interface QueuedAnimationEvent {
  event: AnimationEvent;

  triggerAt: number;
}


export function createEventQueue(
  events: AnimationEvent[]
): QueuedAnimationEvent[] {

  return events.map(
    (event, index) => ({
      event,

      triggerAt:
        index * 2000,
    })
  );
}