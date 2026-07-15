"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: number;
  type: string;
  message: string;
  timestamp: string;
};

export default function NotificationCenter() {
  const [
    notifications,
    setNotifications,
  ] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    const source =
      new EventSource(
        "/api/events"
      );

    source.addEventListener(
      "workflow",
      (event: Event) => {
        const data =
          JSON.parse(
            (
              event as MessageEvent
            ).data
          );

        setNotifications(
          (prev) => [
            {
              id:
                Date.now(),
              type:
                "workflow",
              message: `Post #${data.postId} moved to ${data.status}`,
              timestamp:
                new Date().toISOString(),
            },
            ...prev,
          ].slice(0, 20)
        );
      }
    );

    source.addEventListener(
      "breaking",
      (event: Event) => {
        const data =
          JSON.parse(
            (
              event as MessageEvent
            ).data
          );

        setNotifications(
          (prev) => [
            {
              id:
                Date.now(),
              type:
                "breaking",
              message: `Post #${data.postId} promoted to Breaking News`,
              timestamp:
                new Date().toISOString(),
            },
            ...prev,
          ].slice(0, 20)
        );
      }
    );

    return () => {
      source.close();
    };
  }, []);

  return (
    <div className="admin-card">
      <h2>
        Notification Center
      </h2>

      {notifications.length ===
      0 ? (
        <p>
          No notifications
          yet.
        </p>
      ) : (
        notifications.map(
          (
            notification
          ) => (
            <div
              key={
                notification.id
              }
              className="timeline-row"
              style={{
                borderBottom:
                  "1px solid #eee",
                padding:
                  "10px 0",
              }}
            >
              <strong>
                {
                  notification.type
                }
              </strong>

              <div>
                {
                  notification.message
                }
              </div>

              <small>
                {new Date(
                  notification.timestamp
                ).toLocaleString()}
              </small>
            </div>
          )
        )
      )}
    </div>
  );
}