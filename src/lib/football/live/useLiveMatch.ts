// src/lib/football/live/useLiveMatch.ts

"use client";

import { useMemo } from "react";

import { useLiveStore } from "./liveStore";

export function useLiveMatch() {

  const match =
    useLiveStore(
      (state) => state.match
    );

  const events =
    useLiveStore(
      (state) => state.events
    );

  const statistics =
    useLiveStore(
      (state) => state.statistics
    );

  const lineups =
    useLiveStore(
      (state) => state.lineups
    );

  const animations =
    useLiveStore(
      (state) => state.animations
    );

  const connected =
    useLiveStore(
      (state) => state.connected
    );

  const loading =
    useLiveStore(
      (state) => state.loading
    );

  const lastUpdated =
    useLiveStore(
      (state) => state.lastUpdated
    );

  return useMemo(
    () => ({
      match,
      events,
      statistics,
      lineups,
      animations,
      connected,
      loading,
      lastUpdated,
    }),
    [
      match,
      events,
      statistics,
      lineups,
      animations,
      connected,
      loading,
      lastUpdated,
    ]
  );

}