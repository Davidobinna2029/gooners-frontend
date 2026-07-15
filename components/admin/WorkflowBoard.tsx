"use client";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  getWorkflows,
  updateWorkflow,
  type Workflow,
} from "@/lib/admin/workflows";

import { useNewsroomEvents } from "@/hooks/useNewsroomEvents";

export default function WorkflowBoard() {
  const [workflows, setWorkflows] =
    useState<Workflow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const loadWorkflows =
    useCallback(async () => {
      try {
        const data =
          await getWorkflows();

        setWorkflows(data);

        setLastUpdated(
          new Date()
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  /**
   * LIVE SSE REFRESH
   */
  useNewsroomEvents(() => {
    loadWorkflows();
  });

  async function handleStatusChange(
    id: string,
    status: Workflow["status"]
  ) {
    try {
      setUpdatingId(id);

      await updateWorkflow(
        id,
        status
      );

      await loadWorkflows();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update workflow"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="admin-card">
        Loading workflows...
      </div>
    );
  }

  return (
    <div className="workflow-board">

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
        <div className="admin-section-title">
          Workflow Board
        </div>

        {lastUpdated && (
          <small>
            Updated:{" "}
            {lastUpdated.toLocaleTimeString()}
          </small>
        )}
      </div>

      {workflows.length === 0 ? (
        <div className="admin-card">
          No workflow events yet
        </div>
      ) : (
        workflows.map(
          (workflow) => (
            <div
              key={workflow.id}
              className="workflow-card"
            >
              <div className="workflow-header">
                <strong>
                  Post #
                  {workflow.postId}
                </strong>

                <span
                  className={`workflow-status workflow-${workflow.status.toLowerCase()}`}
                >
                  {workflow.status}
                </span>
              </div>

              <div className="workflow-meta">
                Updated by:{" "}
                {
                  workflow.updatedBy
                }
              </div>

              <div className="workflow-meta">
                Last Updated:{" "}
                {new Date(
                  workflow.updatedAt
                ).toLocaleString()}
              </div>

              <div className="workflow-actions">

                <button
                  disabled={
                    updatingId ===
                    workflow.id
                  }
                  onClick={() =>
                    handleStatusChange(
                      workflow.id,
                      "DRAFT"
                    )
                  }
                >
                  Draft
                </button>

                <button
                  disabled={
                    updatingId ===
                    workflow.id
                  }
                  onClick={() =>
                    handleStatusChange(
                      workflow.id,
                      "IN_REVIEW"
                    )
                  }
                >
                  Review
                </button>

                <button
                  disabled={
                    updatingId ===
                    workflow.id
                  }
                  onClick={() =>
                    handleStatusChange(
                      workflow.id,
                      "APPROVED"
                    )
                  }
                >
                  Approve
                </button>

                <button
                  disabled={
                    updatingId ===
                    workflow.id
                  }
                  onClick={() =>
                    handleStatusChange(
                      workflow.id,
                      "PUBLISHED"
                    )
                  }
                >
                  Publish
                </button>

                <button
                  disabled={
                    updatingId ===
                    workflow.id
                  }
                  onClick={() =>
                    handleStatusChange(
                      workflow.id,
                      "REJECTED"
                    )
                  }
                >
                  Reject
                </button>

              </div>

              {updatingId ===
                workflow.id && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    opacity: 0.7,
                  }}
                >
                  Updating...
                </div>
              )}
            </div>
          )
        )
      )}
    </div>
  );
}