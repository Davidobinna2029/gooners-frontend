"use client";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import { useNewsroomEvents } from "@/hooks/useNewsroomEvents";

export default function AuditLogViewer() {
  const [logs, setLogs] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadLogs =
    useCallback(async () => {
      try {
        const res =
          await fetch(
            "/api/audit-logs",
            {
              cache:
                "no-store",
            }
          );

        if (!res.ok) {
          throw new Error(
            "Failed to load logs"
          );
        }

        const data =
          await res.json();

        setLogs(data);
      } catch (error) {
        console.error(
          "Audit logs error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  /**
   * LIVE SSE REFRESH
   */
  useNewsroomEvents(() => {
    loadLogs();
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
        <h2>Audit Logs</h2>

        <span
          style={{
            fontSize: 12,
            color: "#16a34a",
            fontWeight: 600,
          }}
        >
          LIVE
        </span>
      </div>

      {loading ? (
        <p>
          Loading audit logs...
        </p>
      ) : logs.length === 0 ? (
        <p>
          No audit logs found.
        </p>
      ) : (
        <div className="audit-list">
          {logs.map((log) => (
            <div
              key={log.id}
              className="audit-row"
            >
              <div
                className="audit-header"
              >
                <strong>
                  {log.action}
                </strong>

                <span>
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </span>
              </div>

              <div>
                <strong>
                  Post:
                </strong>{" "}
                #
                {log.targetId ??
                  "N/A"}
              </div>

              <div>
                <strong>
                  User:
                </strong>{" "}
                {log.user
                  ?.email ??
                  "Unknown"}
              </div>

              {log.metadata && (
                <div
                  className="audit-meta"
                >
                  <strong>
                    Metadata
                  </strong>

                  <pre>
                    {JSON.stringify(
                      log.metadata,
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}