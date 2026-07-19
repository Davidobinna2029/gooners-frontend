// src/lib/football/live/stateReducer.ts

import type {
  LiveMatchState,
} from "./matchState";

export function createInitialState(): LiveMatchState {
  return {
    players: {},
    minute: 0,
  };
}