import type {
  PlayerProfile,
} from "@/lib/football/advancedProvider";

import type {
  FootballPlayer,
} from "@/src/lib/football/types";

export function adaptPlayer(
  player: PlayerProfile
): FootballPlayer {

  return {

    id: player.id,

    name: player.name,

    number: player.number,

    position: player.position,

  };

}