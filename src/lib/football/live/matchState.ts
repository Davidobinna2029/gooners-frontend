// src/lib/football/live/matchState.ts

import type {
  LivePlayerState,
} from "./playerState";

export interface LiveMatchState {
  players: Record<
    number,
    LivePlayerState
  >;

  minute: number;

  ball?: {
    x: number;
    y: number;
  };
}