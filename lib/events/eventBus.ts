import {
  publishEvent,
  type NewsroomEventType,
} from "@/lib/newsroom/events";

type EventPayload = Record<
  string,
  unknown
>;

const clients =
  new Set<ReadableStreamDefaultController>();

const encoder =
  new TextEncoder();

export function addClient(
  controller: ReadableStreamDefaultController
) {
  clients.add(controller);
}

export function removeClient(
  controller: ReadableStreamDefaultController
) {
  clients.delete(controller);
}

export function broadcast(
  type: NewsroomEventType,
  payload: EventPayload
) {
  /**
   * Publish internally
   */
  publishEvent({
    type,
    payload,
  });

  /**
   * Broadcast to SSE clients
   */
  const message =
    `event: ${type}\n` +
    `data: ${JSON.stringify({
      ...payload,
      timestamp:
        Date.now(),
    })}\n\n`;

  for (const client of clients) {
    try {
      client.enqueue(
        encoder.encode(message)
      );
    } catch {
      clients.delete(client);
    }
  }
}

export function clientCount() {
  return clients.size;
}