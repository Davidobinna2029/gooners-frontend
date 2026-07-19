// src/lib/football/live/matchPoller.ts

import {
  createFootballRepository,
} from "@/src/lib/football/repository/createFootballRepository";

import {
  diffEvents,
  buildPlayerStates,
} from "./matchDiff";

import {
  useLiveStore,
} from "./liveStore";

import {
  footballAnimationQueue,
} from "@/src/design-system/football/animation";

import type {
  FootballEvent,
} from "@/src/lib/football/types";

let pollTimer: ReturnType<typeof setInterval> | null = null;

let previousEvents: FootballEvent[] = [];

/**
 * Starts polling a live football match.
 *
 * Flow:
 *
 * API
 * ↓
 * Event Diff
 * ↓
 * Player States
 * ↓
 * Animation Queue
 * ↓
 * Live Store
 */
export async function startMatchPolling(
  matchId: number,
  interval = 10000
) {

  stopMatchPolling();

  const repository =
    createFootballRepository();

  const poll = async () => {

    try {

      const events =
        await repository.getEvents(
          matchId
        );

      const diffs =
        diffEvents(
          previousEvents,
          events
        );

      const playerStates =
        buildPlayerStates(
          diffs
        );

      /**
       * Queue animations
       */
      for (const diff of diffs) {

        switch (diff.type) {

          case "GOAL":

            footballAnimationQueue.enqueue({

              id: crypto.randomUUID(),

              type: "goal",

              playerId:
                diff.event.playerId,

              teamId:
                diff.event.teamId,

              minute:
                diff.event.minute,

              duration: 3000,

              title: "GOAL",

              subtitle:
                diff.event.playerName,

            });

            break;

          case "YELLOW_CARD":

            footballAnimationQueue.enqueue({

              id: crypto.randomUUID(),

              type: "yellow",

              playerId:
                diff.event.playerId,

              teamId:
                diff.event.teamId,

              minute:
                diff.event.minute,

              duration: 2200,

              title:
                "YELLOW CARD",

              subtitle:
                diff.event.playerName,

            });

            break;

          case "RED_CARD":

            footballAnimationQueue.enqueue({

              id: crypto.randomUUID(),

              type: "red",

              playerId:
                diff.event.playerId,

              teamId:
                diff.event.teamId,

              minute:
                diff.event.minute,

              duration: 2500,

              title:
                "RED CARD",

              subtitle:
                diff.event.playerName,

            });

            break;

          case "SUBSTITUTION":

            footballAnimationQueue.enqueue({

              id: crypto.randomUUID(),

              type:
                "substitution",

              playerId:
                diff.event.playerId,

              minute:
                diff.event.minute,

              duration: 2500,

              title:
                "SUBSTITUTION",

              subtitle:
                diff.event.playerName,

            });

            break;

          default:

            break;

        }

      }

      /**
       * Update Live Store
       */

      const store =
        useLiveStore.getState();

      store.setEvents(events);

      Object.entries(
        playerStates
      ).forEach(
        ([playerId, state]) => {

          store.setPlayerState(
            Number(playerId),
            state
          );

        }
      );

      store.updateTimestamp();

      store.setConnected(true);

      previousEvents = events;

    } catch (error) {

      console.error(
        "[MatchPoller]",
        error
      );

      useLiveStore
        .getState()
        .setConnected(false);

    }

  };

  await poll();

  pollTimer = setInterval(
    poll,
    interval
  );

}

/**
 * Stops polling.
 */
export function stopMatchPolling() {

  if (pollTimer) {

    clearInterval(
      pollTimer
    );

    pollTimer = null;

  }

}

/**
 * Resets cached polling state.
 */
export function resetMatchPolling() {

  stopMatchPolling();

  previousEvents = [];

}