"use client";

import { useState } from "react";

export default function BreakingPage() {
  const [postId, setPostId] = useState("");

  async function triggerBreaking() {
    await fetch("/api/overrides/breaking", {
      method: "POST",
      body: JSON.stringify({ postId }),
    });
  }

  return (
    <div className="breaking-panel">
      <h2>Breaking News Control</h2>

      <input
        placeholder="Post ID"
        value={postId}
        onChange={(e) => setPostId(e.target.value)}
      />

      <button onClick={triggerBreaking}>
        Force Breaking News
      </button>
    </div>
  );
}