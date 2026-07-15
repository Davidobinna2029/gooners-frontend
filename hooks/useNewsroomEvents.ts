"use client";

import {
  useEffect,
  useRef,
} from "react";

export function useNewsroomEvents(
  callback: () => void
) {
  const callbackRef =
    useRef(callback);

  useEffect(() => {
    callbackRef.current =
      callback;
  }, [callback]);

  useEffect(() => {
    const source =
      new EventSource(
        "/api/events/stream"
      );

    const refresh = () => {
      callbackRef.current();
    };

    source.addEventListener(
      "workflow",
      refresh
    );

    source.addEventListener(
      "override",
      refresh
    );

    source.addEventListener(
      "hero",
      refresh
    );

    source.addEventListener(
      "breaking",
      refresh
    );

    source.addEventListener(
      "audit",
      refresh
    );

    source.onopen = () => {
      console.log(
        "🟢 Newsroom connected"
      );
    };

    source.onerror = () => {
      console.warn(
        "🔴 Newsroom disconnected"
      );
    };

    return () => {
      source.close();
    };
  }, []);
}