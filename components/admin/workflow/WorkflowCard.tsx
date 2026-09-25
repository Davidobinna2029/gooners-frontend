"use client";

import WorkflowActions from "./WorkflowActions";

type WorkflowStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

interface WorkflowCardProps {
  post: {
    id: string;
    postId: number;
    title: string;
    slug: string | null;
    author: string;
    category: string;
    image: string | null;
    articleUrl: string | null;
    updatedAt: string;
    status: WorkflowStatus;
  };

  onUpdated?: (workflow: {
    id: string;
    postId: number;
    status: WorkflowStatus;
    updatedBy: string;
    updatedAt: string;
  }) => void;
}

export default function WorkflowCard({
  post,
  onUpdated,
}: WorkflowCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-gray-50 transition hover:bg-white">

      {/* Featured image */}
      {post.image && (
        <div className="aspect-video w-full overflow-hidden bg-gray-200">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="p-3">

        {/* Category */}
        {post.category && (
          <div className="mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              {post.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-medium text-sm leading-5 line-clamp-3">
          {post.title ||
            `Post #${post.postId}`}
        </h3>

        {/* Article metadata */}
        <div className="mt-2 space-y-1 text-xs text-gray-500">

          <p>
            <strong>
              Author:
            </strong>{" "}
            {post.author ||
              "Unknown Author"}
          </p>

          <p>
            <strong>
              Post ID:
            </strong>{" "}
            {post.postId}
          </p>

          <p>
            <strong>
              Status:
            </strong>{" "}
            <span className="font-semibold text-gray-900">
              {post.status}
            </span>
          </p>

          <p>
            <strong>
              Updated:
            </strong>{" "}
            {new Date(
              post.updatedAt
            ).toLocaleString()}
          </p>

        </div>

        {/* Article link */}
        {post.articleUrl && (
          <a
            href={
              post.slug
                ? `/news/${post.slug}`
                : post.articleUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-xs font-medium text-red-600 hover:underline"
          >
            View article →
          </a>
        )}

        {/* Workflow controls */}
        <WorkflowActions
          postId={post.postId}
          currentStatus={post.status}
          onUpdated={onUpdated}
        />

      </div>
    </div>
  );
}