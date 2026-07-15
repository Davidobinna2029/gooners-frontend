"use client";

import { useEffect, useRef } from "react";

import type {
  HomepageLayoutState,
} from "@/components/admin/homepage-editor/context/HomepageEditorContext";

export function useHomepageAutosave(
  layout: HomepageLayoutState
) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/homepage/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            layout,
            editor: "Homepage Designer",
          }),
        });

        if (!response.ok) {
          throw new Error("Autosave failed.");
        }

        console.log("✓ Homepage autosaved");
      } catch (error) {
        console.error(error);
      }
    }, 1500);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [layout]);
}