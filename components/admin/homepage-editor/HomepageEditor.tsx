"use client";

import { useEffect } from "react";

import DragProvider from "./dnd/DragProvider";

import StoryLibrary from "./StoryLibrary";
import HomepageCanvas from "./HomepageCanvas";
import EditorToolbar from "./EditorToolbar";
import DraftManager from "./DraftManager";
import PublicationHistory from "./PublicationHistory";

import {
  HomepageEditorProvider,
  useHomepageEditor,
} from "./context/HomepageEditorContext";

import { HistoryProvider } from "./history/HistoryProvider";

import { useHomepageRankings } from "@/hooks/useHomepageRankings";
import { useHomepageAutosave } from "@/hooks/useHomepageAutosave";

import { rankingsToLayout } from "@/lib/homepage/rankingsToLayout";

function HomepageEditorContent() {
  const { data, loading } = useHomepageRankings();

  const {
    layout,
    setLayout,
  } = useHomepageEditor();

  /*
   * Automatically save the current editing session
   * every time the homepage layout changes.
   */
  useHomepageAutosave(layout);

  useEffect(() => {
    if (loading) return;

    setLayout(rankingsToLayout(data));
  }, [loading, data, setLayout]);

  return (
    <DragProvider>
      <section className="homepage-designer">
        <header className="designer-header">
          <h1>Homepage Designer</h1>

          <p>
            Drag stories onto the homepage and publish your
            newsroom layout.
          </p>
        </header>

        <EditorToolbar />

        <DraftManager />

        <PublicationHistory />

        <div className="designer-layout">
          <StoryLibrary />

          <HomepageCanvas />
        </div>
      </section>
    </DragProvider>
  );
}

export default function HomepageEditor() {
  return (
    <HistoryProvider>
      <HomepageEditorProvider>
        <HomepageEditorContent />
      </HomepageEditorProvider>
    </HistoryProvider>
  );
}