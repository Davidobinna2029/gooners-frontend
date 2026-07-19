"use client";

import type { Match } from "@/lib/football/types/match";

import {
  mapMatchEventToAnimation,
  useMatchAnimations,
  normalizeMatchEvent,
} from "@/src/lib/football/events";

import {
  useMatchState,
} from "@/src/lib/football/live";

import {
  getMatchElapsedSeconds,
} from "@/src/lib/football/matchClock";

import {
  FootballPitch,
} from "@/src/design-system";

import type {
  AnimationEvent,
} from "@/src/design-system/football/animation";

import type {
  FootballPlayer,
} from "@/src/lib/football/types";

interface Props {
  match: Match;

  /**
   * Temporary until every provider returns
   * the canonical FootballEvent model.
   */
  events: any[];

  players: FootballPlayer[];

  formation: string;
}

function isAnimationEvent(
  event: AnimationEvent | null
): event is AnimationEvent {
  return event !== null;
}

export default function MatchAnimationController({
  match,
  events,
  players,
  formation,
}: Props) {
  /**
   * Normalize provider events.
   */
  const normalizedEvents = events.map((event) =>
    normalizeMatchEvent(event as any)
  );

  /**
   * Build live player state.
   */
  const liveState =
    useMatchState(normalizedEvents);

  /**
   * Convert match events into animations.
   */
  const animationEvents =
    normalizedEvents
      .map(mapMatchEventToAnimation)
      .filter(isAnimationEvent);

  /**
   * Active animation queue.
   */
  const activeAnimations =
    useMatchAnimations(
      animationEvents,
      getMatchElapsedSeconds(
        (match as any).kickoff
      )
    );

  return (
    <FootballPitch
      formation={formation}
      players={players}
      animationEvents={activeAnimations}
      liveState={liveState}
    />
  );
}