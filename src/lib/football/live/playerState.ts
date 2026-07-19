// src/lib/football/live/playerState.ts

export interface LivePlayerState {
  id: number;

  goal: boolean;

  yellowCard: boolean;

  redCard: boolean;

  substituted: boolean;

  active: boolean;

  pulse: boolean;

  rating?: number;
}