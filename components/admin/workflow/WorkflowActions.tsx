"use client";

import { useEffect, useState } from "react";

type WorkflowStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

interface WorkflowActionsProps {
  postId: number;
  currentStatus: WorkflowStatus;

  onUpdated?: (workflow: {
    id: string;
    postId: number;
    status: WorkflowStatus;
    updatedBy: string;
    updatedAt: string;
  }) => void;
}

const ACTIONS: Array<{
  label: string;
  status: WorkflowStatus;
}> = [
  {
    label: "Draft",
    status: "DRAFT",
  },
  {
    label: "Review",
    status: "IN_REVIEW",
  },
  {
    label: "Approve",
    status: "APPROVED",
  },
  {
    label: "Publish",
    status: "PUBLISHED",
  },
  {
    label: "Reject",
    status: "REJECTED",
  },
];

export default function WorkflowActions({
  postId,
  currentStatus,
  onUpdated,
}: WorkflowActionsProps) {
  const [localStatus, setLocalStatus] =
    useState<WorkflowStatus>(
      currentStatus
    );

  const [updating, setUpdating] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const [messageType, setMessageType] =
    useState<
      "error" | "warning" | null
    >(null);

  /*
   * Keep the local status synchronized
   * if the parent receives fresh workflow
   * data.
   */
  useEffect(() => {
    setLocalStatus(
      currentStatus
    );
  }, [currentStatus]);

  async function updateStatus(
    status: WorkflowStatus
  ) {
    if (
      updating ||
      status === localStatus
    ) {
      return;
    }

    try {
      setUpdating(true);
      setMessage(null);
      setMessageType(null);

      const response =
        await fetch(
          "/api/workflows",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              postId,
              status,
            }),
          }
        );

      const data =
        await response.json();

      /*
       * HTTP 207 is considered a successful
       * editorial update because WordPress
       * succeeded while Neon was unavailable.
       */
      if (
        !response.ok &&
        response.status !== 207
      ) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to update workflow."
        );
      }

      const updatedStatus =
        data?.status ??
        status;

      setLocalStatus(
        updatedStatus
      );

      onUpdated?.({
        id:
          data?.id ??
          `wp-${postId}`,

        postId:
          data?.postId ??
          postId,

        status:
          updatedStatus,

        updatedBy:
          data?.updatedBy ??
          "Current user",

        updatedAt:
          data?.updatedAt ??
          new Date().toISOString(),
      });

      if (
        data?.neonAvailable ===
        false
      ) {
        setMessage(
          "Saved to WordPress. Neon workflow storage is currently unavailable."
        );

        setMessageType(
          "warning"
        );
      }
    } catch (err) {
      console.error(
        "Workflow update failed:",
        err
      );

      setMessage(
        err instanceof Error
          ? err.message
          : "Failed to update workflow."
      );

      setMessageType(
        "error"
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map(
          (action) => {
            const isCurrent =
              action.status ===
              localStatus;

            return (
              <button
                key={
                  action.status
                }
                type="button"
                disabled={
                  updating ||
                  isCurrent
                }
                onClick={() =>
                  updateStatus(
                    action.status
                  )
                }
                className={[
                  "rounded-md border px-2.5 py-1.5 text-xs font-medium transition",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  isCurrent
                    ? "bg-gray-900 text-white"
                    : "bg-white hover:bg-gray-100",
                ].join(" ")}
              >
                {updating &&
                isCurrent
                  ? "Updating..."
                  : action.label}
              </button>
            );
          }
        )}
      </div>

      {message && (
        <p
          className={[
            "mt-2 text-xs",
            messageType ===
            "warning"
              ? "text-amber-600"
              : "text-red-600",
          ].join(" ")}
        >
          {message}
        </p>
      )}
    </div>
  );
}