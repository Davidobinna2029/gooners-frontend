// src/lib/football/liveEngine/useLiveMatch.ts

import {
  useMemo,
} from "react";

import {
  useMatchState,
} from "@/src/lib/football/live";

import {
  useMatchAnimations,
  mapMatchEventToAnimation,
} from "@/src/lib/football/events";

import {
  createLiveMatchEngine,
} from "./liveMatchEngine";

import type {
  FootballPlayer,
} from "@/src/lib/football/types";

import type {
  AnimationEvent,
} from "@/src/design-system/football/animation";

interface UseLiveMatchProps {
  players: FootballPlayer[];

  formation: string;

  /**
   * Provider events.
   * Temporarily loose until all providers share one event model.
   */
  events: any[];

  elapsedSeconds: number;
}

function isAnimationEvent(
  event: AnimationEvent | null
): event is AnimationEvent {
  return event !== null;
}

export function useLiveMatch({
  players,
  formation,
  events,
  elapsedSeconds,
}: UseLiveMatchProps) {
  const state =
    useMatchState(events);

  const animations =
    useMatchAnimations(
      events
        .map(mapMatchEventToAnimation)
        .filter(isAnimationEvent),
      elapsedSeconds
    );

  return useMemo(
    () =>
      createLiveMatchEngine({
        players,
        formation,
        state,
        animations,
      }),
    [
      players,
      formation,
      state,
      animations,
    ]
  );
}