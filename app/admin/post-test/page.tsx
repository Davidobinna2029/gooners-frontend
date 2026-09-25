"use client";

import { useState } from "react";

export default function PostTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function createTestDraft() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `ArsenalTalks API Test Draft ${Date.now()}`,
          slug: `arsenaltalks-api-test-${Date.now()}`,
          excerpt: "Temporary test draft created through the ArsenalTalks editorial API.",
          content:
            "<p>This is a temporary test draft created through the ArsenalTalks Next.js editorial system.</p>",
          categories: [],
          status: "DRAFT",
        }),
      });

      const data = await response.json();

      setResult({
        status: response.status,
        data,
      });
    } catch (error) {
      setResult({
        error: String(error),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "60px auto",
        padding: "0 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>ArsenalTalks Post API Test</h1>

      <p>
        This temporary page tests authenticated WordPress post creation.
      </p>

      <button
        type="button"
        onClick={createTestDraft}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "14px 22px",
          background: "#D10000",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 700,
        }}
      >
        {loading ? "Creating Draft..." : "Create Test Draft"}
      </button>

      {result && (
        <pre
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#f5f5f5",
            borderRadius: "8px",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}