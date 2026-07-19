import type {
  TeamLineup,
} from "@/lib/football/advancedProvider";

import type {
  FootballLineup,
} from "@/src/lib/football/types";

export function adaptLineup(
  lineup: TeamLineup
): FootballLineup {

  return {

    teamId: lineup.teamId,

    formation: lineup.formation,

    coach: {
      id: 0,
      name: lineup.coach,
    },

    startingXI:
      lineup.startingXI.map(player => ({

        id: player.id,

        name: player.name,

        number: player.number,

        position: player.position,

        captain: player.captain,

      })),

    substitutes:
      lineup.substitutes.map(player => ({

        id: player.id,

        name: player.name,

        number: player.number,

        position: player.position,

        captain: player.captain,

      })),

  };

}