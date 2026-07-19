// src/lib/football/liveEngine/types.ts

import type {
  AnimationEvent,
} from "@/src/design-system/football/animation";

import type {
  LiveMatchState,
} from "@/src/lib/football/live";

import type {
  FootballPlayer,
} from "@/src/lib/football/types";

export interface LiveMatchEngine {
  /**
   * Players currently displayed on the pitch.
   */
  players: FootballPlayer[];

  /**
   * Active formation (4-3-3, 4-2-3-1, etc.)
   */
  formation: string;

  /**
   * Current live state.
   */
  state: LiveMatchState;

  /**
   * Active animation queue.
   */
  animations: AnimationEvent[];
}