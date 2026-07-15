"use client";

import { useEffect, useState } from "react";

interface Publication {
  id: string;

  draftId?: string | null;

  title: string;

  publishedBy: string;

  publishedAt: string;

  notes?: string | null;

  restoredFrom?: string | null;
}

export default function PublicationHistory() {
  const [history, setHistory] =
    useState<Publication[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [restoring, setRestoring] =
    useState<string | null>(null);

  async function loadHistory() {
    try {
      const response = await fetch(
        "/api/homepage/publications",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load publication history."
        );
      }

      const json =
        await response.json();

      setHistory(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function previewPublication(
    id: string
  ) {
    window.open(
      `/preview/homepage?publication=${id}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function restorePublication(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Restore this homepage version?"
      );

    if (!confirmed) return;

    try {
      setRestoring(id);

      const response = await fetch(
        `/api/homepage/publications/${id}/restore`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Restore failed."
        );
      }

      alert(
        "✅ Homepage restored successfully."
      );

      await loadHistory();
    } catch (error) {
      console.error(error);

      alert(
        "❌ Failed to restore homepage."
      );
    } finally {
      setRestoring(null);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <section className="designer-publications">
      <h2>
        Homepage Publication History
      </h2>

      {loading && (
        <p>
          Loading publication history...
        </p>
      )}

      {!loading &&
        history.length === 0 && (
          <p>
            No homepage publications yet.
          </p>
        )}

      {history.map((item) => (
        <div
          key={item.id}
          className="designer-publication-card"
        >
          <div>
            <h3>
              {item.title}
            </h3>

            <small>
              Published{" "}
              {new Date(
                item.publishedAt
              ).toLocaleString()}
            </small>

            <br />

            <small>
              By {item.publishedBy}
            </small>

            {item.notes && (
              <>
                <br />

                <small>
                  {item.notes}
                </small>
              </>
            )}

            {item.restoredFrom && (
              <>
                <br />

                <small>
                  ↩ Restored from another publication
                </small>
              </>
            )}
          </div>

          <div className="designer-publication-actions">
            <button
              className="designer-btn secondary"
              onClick={() =>
                previewPublication(item.id)
              }
            >
              👁 Preview
            </button>

            <button
              className="designer-btn primary"
              disabled={
                restoring === item.id
              }
              onClick={() =>
                restorePublication(item.id)
              }
            >
              {restoring === item.id
                ? "Restoring..."
                : "♻ Restore"}
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}