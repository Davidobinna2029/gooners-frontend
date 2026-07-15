"use client";

import { useEffect, useState } from "react";

import { useHomepageEditor } from "./context/HomepageEditorContext";

interface HomepageDraft {
  id: string;
  name: string;
  published: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  layout?: any;
}

export default function DraftManager() {
  const { setLayout } = useHomepageEditor();

  const [drafts, setDrafts] = useState<
    HomepageDraft[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [publishingId, setPublishingId] =
    useState<string | null>(null);

  async function loadDrafts() {
    try {
      const response = await fetch(
        "/api/homepage-drafts",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load drafts."
        );
      }

      const json =
        await response.json();

      setDrafts(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function loadDraft(
    id: string
  ) {
    try {
      const response = await fetch(
        `/api/homepage-drafts/${id}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load draft."
        );
      }

      const draft =
        await response.json();

      if (draft.layout) {
        setLayout(draft.layout);

        alert(
          "✅ Draft loaded successfully."
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "❌ Failed to load draft."
      );
    }
  }

  async function publishDraft(
    id: string
  ) {
    try {
      setPublishingId(id);

      const response = await fetch(
        `/api/homepage-drafts/${id}/publish`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to publish draft."
        );
      }

      await loadDrafts();

      alert(
        "🚀 Homepage published successfully."
      );
    } catch (error) {
      console.error(error);

      alert(
        "❌ Failed to publish homepage."
      );
    } finally {
      setPublishingId(null);
    }
  }

  async function deleteDraft(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this draft?"
      );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/homepage-drafts/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete draft."
        );
      }

      await loadDrafts();

      alert(
        "🗑 Draft deleted."
      );
    } catch (error) {
      console.error(error);

      alert(
        "❌ Failed to delete draft."
      );
    }
  }

  useEffect(() => {
    loadDrafts();
  }, []);

  return (
    <section className="designer-drafts">
      <h2>Homepage Drafts</h2>

      {loading && (
        <p>Loading drafts...</p>
      )}

      {!loading &&
        drafts.length === 0 && (
          <p>No drafts found.</p>
        )}

      {drafts.map((draft) => (
        <div
          key={draft.id}
          className="designer-draft-card"
        >
          <div>
            <h3>
              {draft.name}

              {draft.published && (
                <span
                  style={{
                    marginLeft: 10,
                    color: "green",
                    fontSize: 12,
                  }}
                >
                  ● Published
                </span>
              )}
            </h3>

            <small>
              Updated{" "}
              {new Date(
                draft.updatedAt
              ).toLocaleString()}
            </small>
          </div>

          <div className="designer-draft-actions">
            <button
              onClick={() =>
                loadDraft(draft.id)
              }
            >
              Load
            </button>

            <button
              onClick={() =>
                publishDraft(draft.id)
              }
              disabled={
                publishingId === draft.id
              }
            >
              {publishingId === draft.id
                ? "Publishing..."
                : "Publish"}
            </button>

            <button
              onClick={() =>
                deleteDraft(draft.id)
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}