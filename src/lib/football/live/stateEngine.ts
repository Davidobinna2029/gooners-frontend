// src/lib/football/live/stateEngine.ts

import {
  createInitialState,
} from "./stateReducer";

export class MatchStateEngine {
  state =
    createInitialState();

  setMinute(
    minute: number
  ) {
    this.state.minute =
      minute;
  }

  goal(
    playerId: number
  ) {
    if (
      !this.state.players[
        playerId
      ]
    ) {
      this.state.players[
        playerId
      ] = {
        id: playerId,
        goal: false,
        yellowCard: false,
        redCard: false,
        substituted: false,
        active: true,
        pulse: false,
      };
    }

    this.state.players[
      playerId
    ].goal = true;

    this.state.players[
      playerId
    ].pulse = true;
  }

  yellowCard(
    playerId: number
  ) {
    this.state.players[
      playerId
    ].yellowCard = true;
  }

  redCard(
    playerId: number
  ) {
    this.state.players[
      playerId
    ].redCard = true;
  }

  substitution(
    playerId: number
  ) {
    this.state.players[
      playerId
    ].substituted = true;
  }
}