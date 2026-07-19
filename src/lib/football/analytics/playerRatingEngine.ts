import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface PlayerRating {

  playerId: number;

  playerName: string;

  rating: number;

}

export function calculatePlayerRatings(

  events: FootballEvent[]

): PlayerRating[] {

  const players =
    new Map<number, PlayerRating>();

  for (const event of events) {

    if (!event.playerId) continue;

    if (!players.has(event.playerId)) {

      players.set(
        event.playerId,
        {

          playerId:
            event.playerId,

          playerName:
            event.playerName ??
            "Unknown",

          rating: 6.5,

        }
      );

    }

    const player =
      players.get(event.playerId)!;

    switch (event.type) {

      case "goal":

      case "penalty_goal":

        player.rating += 1.5;

        break;

      case "assist":

        player.rating += 1.2;

        break;

      case "shot":

        player.rating += 0.15;

        break;

      case "save":

        player.rating += 0.40;

        break;

      case "yellow_card":

        player.rating -= 0.35;

        break;

      case "red_card":

        player.rating -= 2;

        break;

      case "tackle":

        player.rating += 0.20;

        break;

      case "interception":

        player.rating += 0.25;

        break;

      case "clearance":

        player.rating += 0.15;

        break;

      default:

        break;

    }

  }

  return [

    ...players.values(),

  ].sort(

    (a, b) =>

      b.rating - a.rating

  );

}