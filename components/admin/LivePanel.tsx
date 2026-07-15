"use client";

import {
  useEffect,
  useState,
} from "react";

type WorkflowEvent = {
  postId: number;
  previousStatus?: string;
  newStatus?: string;
  updatedAt?: string;
};

type BreakingEvent = {
  postId: number;
  reason?: string;
  timestamp?: string;
};

type HeroEvent = {
  postId: number;
  slot?: number;
};

type OverrideEvent = {
  postId: number;
  overrideType?: string;
  reason?: string;
};

type AuditEvent = {
  action?: string;
  postId?: number;
};

export default function LivePanel() {
  const [status, setStatus] =
    useState("connecting");

  const [lastHeartbeat, setLastHeartbeat] =
    useState<string | null>(null);

  const [workflowEvents, setWorkflowEvents] =
    useState<WorkflowEvent[]>([]);

  const [breakingEvents, setBreakingEvents] =
    useState<BreakingEvent[]>([]);

  const [heroEvents, setHeroEvents] =
    useState<HeroEvent[]>([]);

  const [overrideEvents, setOverrideEvents] =
    useState<OverrideEvent[]>([]);

  const [auditEvents, setAuditEvents] =
    useState<AuditEvent[]>([]);

  useEffect(() => {
    const source =
      new EventSource("/api/events");

    source.addEventListener(
      "connected",
      () => {
        setStatus("connected");
      }
    );

    source.addEventListener(
      "heartbeat",
      (event: Event) => {
        setStatus("live");

        try {
          const data = JSON.parse(
            (event as MessageEvent).data
          );

          if (data?.timestamp) {
            setLastHeartbeat(
              data.timestamp
            );
          }
        } catch {}
      }
    );

    source.addEventListener(
      "workflow",
      (event: Event) => {
        try {
          const data = JSON.parse(
            (event as MessageEvent).data
          );

          setWorkflowEvents(
            (prev) =>
              [data, ...prev].slice(0, 25)
          );
        } catch {}
      }
    );

    source.addEventListener(
      "breaking",
      (event: Event) => {
        try {
          const data = JSON.parse(
            (event as MessageEvent).data
          );

          setBreakingEvents(
            (prev) =>
              [data, ...prev].slice(0, 25)
          );
        } catch {}
      }
    );

    source.addEventListener(
      "hero",
      (event: Event) => {
        try {
          const data = JSON.parse(
            (event as MessageEvent).data
          );

          setHeroEvents(
            (prev) =>
              [data, ...prev].slice(0, 25)
          );
        } catch {}
      }
    );

    source.addEventListener(
      "override",
      (event: Event) => {
        try {
          const data = JSON.parse(
            (event as MessageEvent).data
          );

          setOverrideEvents(
            (prev) =>
              [data, ...prev].slice(0, 25)
          );
        } catch {}
      }
    );

    source.addEventListener(
      "audit",
      (event: Event) => {
        try {
          const data = JSON.parse(
            (event as MessageEvent).data
          );

          setAuditEvents(
            (prev) =>
              [data, ...prev].slice(0, 25)
          );
        } catch {}
      }
    );

    source.onerror = () => {
      setStatus("disconnected");
    };

    return () => {
      source.close();
    };
  }, []);

  return (
    <div className="admin-card">
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: 20,
        }}
      >
        <h2>
          Live Newsroom Feed
        </h2>

        <strong>
          {status.toUpperCase()}
        </strong>
      </div>

      {lastHeartbeat && (
        <p
          style={{
            opacity: 0.7,
            marginBottom: 20,
          }}
        >
          Last heartbeat:{" "}
          {new Date(
            lastHeartbeat
          ).toLocaleString()}
        </p>
      )}

      <h3>Workflow Events</h3>
      {workflowEvents
        .slice(0, 5)
        .map((event, i) => (
          <div
            key={i}
            className="timeline-row"
          >
            Post #{event.postId}
            <br />
            {event.previousStatus}
            {" → "}
            {event.newStatus}
          </div>
        ))}

      <h3
        style={{
          marginTop: 24,
        }}
      >
        Breaking Events
      </h3>
      {breakingEvents
        .slice(0, 5)
        .map((event, i) => (
          <div
            key={i}
            className="timeline-row"
          >
            Post #{event.postId}
            <br />
            {event.reason}
          </div>
        ))}

      <h3
        style={{
          marginTop: 24,
        }}
      >
        Hero Assignments
      </h3>
      {heroEvents
        .slice(0, 5)
        .map((event, i) => (
          <div
            key={i}
            className="timeline-row"
          >
            Post #{event.postId}
            → Hero #{event.slot}
          </div>
        ))}

      <h3
        style={{
          marginTop: 24,
        }}
      >
        Override Events
      </h3>
      {overrideEvents
        .slice(0, 5)
        .map((event, i) => (
          <div
            key={i}
            className="timeline-row"
          >
            Post #{event.postId}
            <br />
            {event.overrideType}
          </div>
        ))}

      <h3
        style={{
          marginTop: 24,
        }}
      >
        Audit Events
      </h3>
      {auditEvents
        .slice(0, 5)
        .map((event, i) => (
          <div
            key={i}
            className="timeline-row"
          >
            {event.action}
            <br />
            Post #{event.postId}
          </div>
        ))}
    </div>
  );
}