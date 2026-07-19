// src/design-system/football/animation/types.ts

export type AnimationType =
  | "goal"
  | "yellow"
  | "red"
  | "substitution"
  | "ball"
  | "highlight"
  | "var"
  | "injury"
  | "fulltime"
  | "halftime"
  | "kickoff";

export interface AnimationEvent {

  /**
   * Unique animation ID.
   */
  id: string;

  /**
   * Animation type.
   */
  type: AnimationType;

  /**
   * Optional player.
   */
  playerId?: number;

  /**
   * Optional team.
   */
  teamId?: number;

  /**
   * Pitch position.
   */
  x?: number;

  y?: number;

  /**
   * Match minute.
   */
  minute?: number;

  /**
   * Animation duration.
   */
  duration?: number;

  /**
   * Optional title.
   *
   * Example:
   * GOAL
   * VAR
   * YELLOW CARD
   */
  title?: string;

  /**
   * Optional subtitle.
   *
   * Example:
   * Bukayo Saka
   */
  subtitle?: string;

}