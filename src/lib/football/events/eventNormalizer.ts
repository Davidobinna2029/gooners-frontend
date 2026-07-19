import type {
  RawMatchEvent,
  NormalizedMatchEvent,
} from "./types";


export function normalizeMatchEvent(
  event: RawMatchEvent
): NormalizedMatchEvent {

  let type: NormalizedMatchEvent["type"] =
    "SHOT";


  switch (
    event.type.toLowerCase()
  ) {
    case "goal":
      type = "GOAL";
      break;

    case "yellow_card":
      type = "YELLOW_CARD";
      break;

    case "red_card":
      type = "RED_CARD";
      break;

    case "substitution":
      type = "SUBSTITUTION";
      break;

    case "corner":
      type = "CORNER";
      break;

    case "penalty":
      type = "PENALTY";
      break;
  }


  return {
    id: event.id,

    type,

    minute:
      event.minute,

    playerId:
      event.player?.id,

    playerName:
      event.player?.name,

    teamId:
      event.team?.id,

    teamName:
      event.team?.name,

    detail:
      event.detail,
  };
}