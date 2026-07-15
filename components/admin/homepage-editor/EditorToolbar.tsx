"use client";

import { useState } from "react";

import { useHistory } from "./history/HistoryProvider";
import { useHomepageEditor } from "./context/HomepageEditorContext";

export default function EditorToolbar() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory();

  const { layout } = useHomepageEditor();

  const [saving, setSaving] = useState(false);

  const [publishing, setPublishing] =
    useState(false);

  async function saveDraft() {
    try {
      setSaving(true);

      const response = await fetch(
        "/api/homepage-drafts",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: `Homepage Draft ${new Date().toLocaleString()}`,
            layout,
            createdBy:
              "Homepage Designer",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save draft."
        );
      }

      alert(
        "✅ Homepage draft saved."
      );
    } catch (error) {
      console.error(error);

      alert(
        "❌ Failed to save homepage draft."
      );
    } finally {
      setSaving(false);
    }
  }

  async function publishHomepage() {
    try {
      setPublishing(true);

      const response = await fetch(
        "/api/homepage/publish",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            layout,

            publishedBy:
              "Homepage Designer",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to publish homepage."
        );
      }

      alert(
        "🚀 Homepage published successfully."
      );

      /*
       * Refresh homepage preview
       */

      window.open(
        "/",
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error(error);

      alert(
        "❌ Failed to publish homepage."
      );
    } finally {
      setPublishing(false);
    }
  }

  function previewHomepage() {
    window.open(
      "/preview/homepage",
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="designer-toolbar">
      <div className="designer-toolbar-left">
        <button
          className="designer-btn secondary"
          type="button"
          onClick={undo}
          disabled={!canUndo}
        >
          ↩ Undo
        </button>

        <button
          className="designer-btn secondary"
          type="button"
          onClick={redo}
          disabled={!canRedo}
        >
          ↪ Redo
        </button>

        <button
          className="designer-btn secondary"
          type="button"
          onClick={saveDraft}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "💾 Save Draft"}
        </button>

        <button
          className="designer-btn secondary"
          type="button"
          onClick={previewHomepage}
        >
          👁 Preview
        </button>

        <button
          className="designer-btn primary"
          type="button"
          onClick={publishHomepage}
          disabled={publishing}
        >
          {publishing
            ? "Publishing..."
            : "🚀 Publish"}
        </button>

        <button
          className="designer-btn secondary"
          type="button"
          onClick={() =>
            window.location.reload()
          }
        >
          🔄 Reload
        </button>
      </div>

      <div className="designer-toolbar-right">
        <span className="designer-status">
          {publishing
            ? "● Publishing..."
            : saving
            ? "● Saving..."
            : "● Ready"}
        </span>
      </div>
    </div>
  );
}