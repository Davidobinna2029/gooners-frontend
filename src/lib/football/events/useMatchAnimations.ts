"use client";

import {
  useMemo,
  useState,
  useEffect,
} from "react";

import type {
  AnimationEvent,
} from "@/src/design-system/football/animation";

import {
  createEventQueue,
} from "./eventQueue";

import {
  buildTimelineState,
} from "./MatchTimelineController";


export function useMatchAnimations(
  events: AnimationEvent[],
  elapsedTime: number
) {

  const queue = useMemo(
    () =>
      createEventQueue(events),
    [events]
  );


  const timeline =
    useMemo(
      () =>
        buildTimelineState(
          queue,
          elapsedTime
        ),
      [
        queue,
        elapsedTime,
      ]
    );


  const [activeEvents, setActiveEvents] =
    useState<AnimationEvent[]>([]);


  useEffect(() => {
    setActiveEvents(
      timeline.activeEvents
    );
  }, [timeline]);


  return activeEvents;
}