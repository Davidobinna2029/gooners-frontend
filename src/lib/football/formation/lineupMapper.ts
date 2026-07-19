// src/lib/football/formation/lineupMapper.ts

import type {
  FootballLineup,
} from "@/src/lib/football/types";

import type {
  FormationPlayer,
} from "./formationEngine";


export function lineupToFormationPlayers(
  lineup: FootballLineup
): FormationPlayer[] {

  return lineup.startingXI.map(
    (player) => ({

      id: player.id,

      name: player.name,

      number: player.number,

      position: player.position,

      captain: player.captain ?? false,

    })
  );

}