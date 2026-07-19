import type {
  NormalizedMatchEvent,
} from "./types";

import type {
  AnimationEvent,
} from "@/src/design-system/football/animation";


export function mapMatchEventToAnimation(
  event: NormalizedMatchEvent
): AnimationEvent | null {

  switch (event.type) {

    case "GOAL":
      return {
        id: event.id,

        type: "goal",

        duration: 3000,
      };


    case "YELLOW_CARD":
      return {
        id: event.id,

        type: "yellow",

        duration: 2000,
      };


    case "RED_CARD":
      return {
        id: event.id,

        type: "red",

        duration: 2500,
      };


    case "SUBSTITUTION":
      return {
        id: event.id,

        type: "substitution",

        duration: 2500,
      };


    case "SHOT":
      return {
        id: event.id,

        type: "ball",

        x: 70,

        y: 45,

        duration: 1500,
      };


    default:
      return null;
  }
}