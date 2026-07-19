// src/design-system/football/animation/animationQueue.ts

import type {
  AnimationEvent,
} from "./types";

export class AnimationQueue {

  private queue: AnimationEvent[] = [];

  private listeners: Array<
    (events: AnimationEvent[]) => void
  > = [];

  enqueue(
    event: AnimationEvent
  ) {

    this.queue.push(event);

    this.emit();

  }

  dequeue() {

    const event =
      this.queue.shift();

    this.emit();

    return event;

  }

  clear() {

    this.queue = [];

    this.emit();

  }

  getEvents() {

    return this.queue;

  }

  subscribe(
    listener: (
      events: AnimationEvent[]
    ) => void
  ) {

    this.listeners.push(listener);

    listener(this.queue);

    return () => {

      this.listeners =
        this.listeners.filter(
          (l) => l !== listener
        );

    };

  }

  private emit() {

    this.listeners.forEach(
      (listener) =>
        listener(this.queue)
    );

  }

}

export const footballAnimationQueue =
  new AnimationQueue();