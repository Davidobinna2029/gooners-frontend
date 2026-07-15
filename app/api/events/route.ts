import {
  subscribeToEvents,
} from "@/lib/newsroom/events";

export async function GET() {
  const encoder =
    new TextEncoder();

  const stream =
    new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `event: connected\n` +
              `data: ${JSON.stringify({
                timestamp:
                  Date.now(),
              })}\n\n`
          )
        );

        const unsubscribe =
          subscribeToEvents(
            (event) => {
              controller.enqueue(
                encoder.encode(
                  `event: ${event.type}\n` +
                    `data: ${JSON.stringify(
                      event
                    )}\n\n`
                )
              );
            }
          );

        const heartbeat =
          setInterval(() => {
            controller.enqueue(
              encoder.encode(
                `event: heartbeat\n` +
                  `data: ${JSON.stringify(
                    {
                      timestamp:
                        Date.now(),
                    }
                  )}\n\n`
              )
            );
          }, 10000);

        return () => {
          clearInterval(
            heartbeat
          );

          unsubscribe();
        };
      },
    });

  return new Response(stream, {
    headers: {
      "Content-Type":
        "text/event-stream",
      "Cache-Control":
        "no-cache",
      Connection:
        "keep-alive",
    },
  });
}