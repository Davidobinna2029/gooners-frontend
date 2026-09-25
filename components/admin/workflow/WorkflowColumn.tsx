"use client";

import WorkflowCard from "./WorkflowCard";

type WorkflowStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

interface WorkflowColumnProps {
  title: string;
  status: WorkflowStatus;

  posts: Array<{
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
  }>;

  onUpdated?: (workflow: {
    id: string;
    postId: number;
    status: WorkflowStatus;
    updatedBy: string;
    updatedAt: string;
  }) => void;
}

export default function WorkflowColumn({
  title,
  status,
  posts,
  onUpdated,
}: WorkflowColumnProps) {
  return (
    <div className="w-[300px] min-w-[300px] rounded-xl bg-white p-3 shadow">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">
          {title}
        </h2>

        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
          {posts.length}
        </span>
      </div>

      <div className="space-y-3">
        {posts.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            post={workflow}
            onUpdated={onUpdated}
          />
        ))}

        {posts.length === 0 && (
          <p className="py-6 text-center text-xs text-gray-400">
            No posts
          </p>
        )}
      </div>
    </div>
  );
}