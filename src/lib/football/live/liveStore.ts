// src/lib/football/live/liveStore.ts

import { create } from "zustand";

import type {
  FootballEvent,
  FootballLineup,
  TeamStatistic,
} from "@/src/lib/football/types";

import type {
  Match,
} from "@/lib/football/types/match";

import type {
  AnimationEvent,
} from "@/src/design-system/football/animation";

import type {
  PlayerLiveState,
} from "./matchDiff";

interface LiveStore {

  match: Match | null;

  events: FootballEvent[];

  statistics: TeamStatistic[];

  lineups: FootballLineup[];

  /**
   * Live player visual states.
   *
   * Key = Player ID
   */
  playerStates: Record<
    number,
    PlayerLiveState
  >;

  animations: AnimationEvent[];

  connected: boolean;

  loading: boolean;

  lastUpdated?: Date;

  setMatch: (
    match: Match
  ) => void;

  setEvents: (
    events: FootballEvent[]
  ) => void;

  setStatistics: (
    statistics: TeamStatistic[]
  ) => void;

  setLineups: (
    lineups: FootballLineup[]
  ) => void;

  /**
   * Updates one player's
   * live visual state.
   */
  setPlayerState: (
    playerId: number,
    state: Partial<PlayerLiveState>
  ) => void;

  /**
   * Clears all live player states.
   */
  clearPlayerStates: () => void;

  addAnimation: (
    animation: AnimationEvent
  ) => void;

  clearAnimations: () => void;

  setConnected: (
    connected: boolean
  ) => void;

  setLoading: (
    loading: boolean
  ) => void;

  updateTimestamp: () => void;

}

export const useLiveStore =
  create<LiveStore>((set) => ({

    match: null,

    events: [],

    statistics: [],

    lineups: [],

    playerStates: {},

    animations: [],

    connected: false,

    loading: false,

    lastUpdated: undefined,

    setMatch: (match) =>
      set({
        match,
      }),

    setEvents: (events) =>
      set({
        events,
      }),

    setStatistics: (statistics) =>
      set({
        statistics,
      }),

    setLineups: (lineups) =>
      set({
        lineups,
      }),

    setPlayerState: (
      playerId,
      state
    ) =>
      set((current) => ({

        playerStates: {

          ...current.playerStates,

          [playerId]: {

            ...(current.playerStates[playerId] ??
              {}),

            ...state,

          },

        },

      })),

    clearPlayerStates: () =>
      set({

        playerStates: {},

      }),

    addAnimation: (
      animation
    ) =>
      set((current) => ({

        animations: [

          ...current.animations,

          animation,

        ],

      })),

    clearAnimations: () =>
      set({

        animations: [],

      }),

    setConnected: (
      connected
    ) =>
      set({

        connected,

      }),

    setLoading: (
      loading
    ) =>
      set({

        loading,

      }),

    updateTimestamp: () =>
      set({

        lastUpdated:
          new Date(),

      }),

  }));