"use client";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import { useNewsroomEvents } from "@/hooks/useNewsroomEvents";

export default function ActivityTimeline() {
  const [logs, setLogs] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const loadTimeline =
    useCallback(async () => {
      try {
        const res = await fetch(
          "/api/activity-timeline",
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            "Failed to load timeline"
          );
        }

        const data =
          await res.json();

        setLogs(
          Array.isArray(data)
            ? data
            : []
        );

        setLastUpdated(
          new Date()
        );
      } catch (error) {
        console.error(
          "Timeline error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  useNewsroomEvents(() => {
    loadTimeline();
  });

  return (
    <div className="admin-card">
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom: 16,
        }}
      >
        <h2>
          Editorial Activity
          Timeline
        </h2>

        <button
          onClick={
            loadTimeline
          }
        >
          Refresh
        </button>
      </div>

      {lastUpdated && (
        <div
          style={{
            fontSize: 12,
            opacity: 0.7,
            marginBottom: 12,
          }}
        >
          Updated:{" "}
          {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {loading ? (
        <p>
          Loading activity...
        </p>
      ) : logs.length === 0 ? (
        <p>
          No activity found.
        </p>
      ) : (
        logs.map((log) => (
          <div
            key={log.id}
            className="timeline-row"
            style={{
              borderBottom:
                "1px solid #eee",
              padding:
                "12px 0",
            }}
          >
            <strong>
              {log.action}
            </strong>

            <div>
              Post:{" "}
              {log.targetId ??
                "N/A"}
            </div>

            <div>
              User:{" "}
              {log.user
                ?.email ??
                "Unknown"}
            </div>

            <div>
              {new Date(
                log.createdAt
              ).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}