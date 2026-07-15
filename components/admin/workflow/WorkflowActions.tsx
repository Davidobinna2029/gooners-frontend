"use client";

import { useTransition } from "react";

export default function WorkflowActions({ post }: any) {
  const [pending, startTransition] = useTransition();

  async function updateStatus(status: string) {
    startTransition(async () => {
      await fetch("/api/workflow/update", {
        method: "POST",
        body: JSON.stringify({
          postId: post.postId,
          status,
        }),
      });
    });
  }

  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      <button onClick={() => updateStatus("IN_REVIEW")}>
        Review
      </button>

      <button onClick={() => updateStatus("APPROVED")}>
        Approve
      </button>

      <button onClick={() => updateStatus("PUBLISHED")}>
        Publish
      </button>

      <button onClick={() => updateStatus("REJECTED")}>
        Reject
      </button>
    </div>
  );
}