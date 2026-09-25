"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import WorkflowColumn from "./WorkflowColumn";

type WorkflowStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

interface Workflow {
  id: string;
  postId: number;
  status: WorkflowStatus;
  updatedBy: string;
  updatedAt: string;

  title: string;
  slug: string | null;
  author: string;
  category: string;
  image: string | null;
  articleUrl: string | null;
}

const COLUMNS: Array<{
  status: WorkflowStatus;
  title: string;
}> = [
  {
    status: "DRAFT",
    title: "Draft",
  },
  {
    status: "IN_REVIEW",
    title: "In Review",
  },
  {
    status: "APPROVED",
    title: "Approved",
  },
  {
    status: "PUBLISHED",
    title: "Published",
  },
  {
    status: "REJECTED",
    title: "Rejected",
  },
];

export default function WorkflowBoard() {
  const [workflows, setWorkflows] =
    useState<Workflow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [source, setSource] =
    useState<
      "neon" | "wordpress" | null
    >(null);

  async function loadWorkflows() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await fetch(
          "/api/workflows",
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to load workflows."
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid workflow response."
        );
      }

      setWorkflows(data);

      const workflowSource =
        response.headers.get(
          "X-ArsenalTalks-Workflow-Source"
        );

      setSource(
        workflowSource ===
          "neon"
          ? "neon"
          : "wordpress"
      );
    } catch (err) {
      console.error(
        "Workflow board load failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load workflows."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkflows();
  }, []);

  function handleUpdated(
    updated: {
      id: string;
      postId: number;
      status: WorkflowStatus;
      updatedBy: string;
      updatedAt: string;
    }
  ) {
    setWorkflows((current) =>
      current.map(
        (workflow) =>
          workflow.postId ===
          updated.postId
            ? {
                ...workflow,
                ...updated,
              }
            : workflow
      )
    );
  }

  const columns = useMemo(
    () =>
      COLUMNS.map(
        (column) => ({
          ...column,

          posts:
            workflows.filter(
              (workflow) =>
                workflow.status ===
                column.status
            ),
        })
      ),
    [workflows]
  );

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-gray-500">
          Loading workflows…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-700">
          {error}
        </p>

        <button
          type="button"
          onClick={loadWorkflows}
          className="mt-3 rounded-md border bg-white px-3 py-1.5 text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Editorial Workflow
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage article workflow
            status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {workflows.length}{" "}
            workflow
            {workflows.length ===
            1
              ? ""
              : "s"}
          </span>

          {source && (
            <span
              className={[
                "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                source === "neon"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-amber-50 text-amber-700",
              ].join(" ")}
            >
              {source === "neon"
                ? "Neon"
                : "WordPress fallback"}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(
          (column) => (
            <WorkflowColumn
              key={
                column.status
              }
              title={
                column.title
              }
              status={
                column.status
              }
              posts={
                column.posts
              }
              onUpdated={
                handleUpdated
              }
            />
          )
        )}
      </div>
    </div>
  );
}