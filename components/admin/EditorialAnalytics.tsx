"use client";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import { useNewsroomEvents } from "@/hooks/useNewsroomEvents";

export default function EditorialAnalytics() {
  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [lastRefresh, setLastRefresh] =
    useState<Date | null>(null);

  const [refreshCount, setRefreshCount] =
    useState(0);

  const loadAnalytics =
    useCallback(async () => {
      try {
        const res =
          await fetch(
            "/api/editorial-analytics",
            {
              cache:
                "no-store",
            }
          );

        if (!res.ok) {
          throw new Error(
            "Failed to load analytics"
          );
        }

        const json =
          await res.json();

        setData(json);

        setLastRefresh(
          new Date()
        );

        setRefreshCount(
          (prev) => prev + 1
        );
      } catch (error) {
        console.error(
          "Analytics error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  useNewsroomEvents(() => {
    loadAnalytics();
  });

  if (loading) {
    return (
      <div className="admin-card">
        <h2>
          Editorial Analytics
        </h2>

        <p>
          Loading analytics...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-card">
        <h2>
          Editorial Analytics
        </h2>

        <p>
          No analytics data
          available.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-card">

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>
          Editorial Analytics
        </h2>

        <div
          style={{
            textAlign: "right",
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          <div>
            Refreshes:
            {" "}
            {refreshCount}
          </div>

          <div>
            Updated:
            {" "}
            {lastRefresh
              ? lastRefresh.toLocaleTimeString()
              : "Never"}
          </div>
        </div>
      </div>

      <div className="analytics-grid">

        <div className="analytics-stat">
          <strong>
            Draft
          </strong>

          <div>
            {data.draft}
          </div>
        </div>

        <div className="analytics-stat">
          <strong>
            Review
          </strong>

          <div>
            {data.review}
          </div>
        </div>

        <div className="analytics-stat">
          <strong>
            Approved
          </strong>

          <div>
            {data.approved}
          </div>
        </div>

        <div className="analytics-stat">
          <strong>
            Published
          </strong>

          <div>
            {data.published}
          </div>
        </div>

        <div className="analytics-stat">
          <strong>
            Rejected
          </strong>

          <div>
            {data.rejected}
          </div>
        </div>

        <div className="analytics-stat">
          <strong>
            Overrides
          </strong>

          <div>
            {data.overrides}
          </div>
        </div>

        <div className="analytics-stat">
          <strong>
            Workflows
          </strong>

          <div>
            {data.workflows}
          </div>
        </div>

        <div className="analytics-stat">
          <strong>
            Audit Events Today
          </strong>

          <div>
            {data.auditsToday}
          </div>
        </div>

      </div>

      <div
        style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop:
            "1px solid #e5e7eb",
        }}
      >
        <strong>
          Last Activity
        </strong>

        <div
          style={{
            marginTop: 6,
          }}
        >
          {data.lastActivity
            ? new Date(
                data.lastActivity
              ).toLocaleString()
            : "No activity"}
        </div>
      </div>

    </div>
  );
}