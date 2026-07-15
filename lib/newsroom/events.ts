export type NewsroomEventType =
  | "workflow"
  | "override"
  | "hero"
  | "breaking"
  | "audit";

export interface NewsroomEvent {
  id: string;
  type: NewsroomEventType;
  payload: unknown;
  timestamp: number;
}

type Listener = (
  event: NewsroomEvent
) => void;

const listeners =
  new Set<Listener>();

export function publishEvent(
  event: Omit<
    NewsroomEvent,
    "id" | "timestamp"
  >
) {
  const fullEvent: NewsroomEvent = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...event,
  };

  for (const listener of listeners) {
    try {
      listener(fullEvent);
    } catch (error) {
      console.error(
        "Newsroom listener failed:",
        error
      );
    }
  }

  return fullEvent;
}

export function subscribeToEvents(
  callback: Listener
) {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}

export function listenerCount() {
  return listeners.size;
}