"use client";

import {
  useEffect,
  useState,
} from "react";

export default function LiveNewsroomStatus() {
  const [status, setStatus] =
    useState("Connecting...");

  const [lastUpdate, setLastUpdate] =
    useState<string | null>(null);

  const [eventCount, setEventCount] =
    useState(0);

  const [connectedAt, setConnectedAt] =
    useState<string | null>(null);

  useEffect(() => {
    const source =
      new EventSource("/api/events");

    source.addEventListener(
      "connected",
      () => {
        setStatus("Connected");

        setConnectedAt(
          new Date().toISOString()
        );
      }
    );

    source.addEventListener(
      "heartbeat",
      () => {
        setStatus("Live");

        setLastUpdate(
          new Date().toISOString()
        );
      }
    );

    source.addEventListener(
      "newsroom_update",
      (event) => {
        try {
          const data = JSON.parse(
            (
              event as MessageEvent
            ).data
          );

          setLastUpdate(
            data.timestamp ??
              new Date().toISOString()
          );

          setEventCount(
            (prev) => prev + 1
          );
        } catch (error) {
          console.error(
            "SSE parse error:",
            error
          );
        }
      }
    );

    source.onerror = () => {
      setStatus(
        "Disconnected"
      );
    };

    return () => {
      source.close();
    };
  }, []);

  const statusColor =
    status === "Live"
      ? "#16a34a"
      : status === "Connected"
      ? "#2563eb"
      : "#dc2626";

  return (
    <div className="admin-card">
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
        }}
      >
        <h2>
          Live Newsroom Status
        </h2>

        <span
          style={{
            color: statusColor,
            fontWeight: 700,
          }}
        >
          ● {status}
        </span>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gap: 12,
        }}
      >
        <div>
          <strong>
            SSE Status:
          </strong>{" "}
          {status}
        </div>

        <div>
          <strong>
            Events Received:
          </strong>{" "}
          {eventCount}
        </div>

        <div>
          <strong>
            Connected:
          </strong>{" "}
          {connectedAt
            ? new Date(
                connectedAt
              ).toLocaleString()
            : "Waiting..."}
        </div>

        <div>
          <strong>
            Last Update:
          </strong>{" "}
          {lastUpdate
            ? new Date(
                lastUpdate
              ).toLocaleString()
            : "Waiting..."}
        </div>
      </div>
    </div>
  );
}