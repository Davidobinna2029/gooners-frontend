// lib/football/providers/apiFootball/advanced/lineupMapper.ts

import type {
  TeamLineup,
  LineupPlayer,
} from "../../../advancedProvider";

export function mapApiFootballLineups(
  response: any[]
): TeamLineup[] {
  return response.map((item) => ({
    teamId:
      item.team.id,

    teamName:
      item.team.name,

    formation:
      item.formation ?? "",

    coach:
      item.coach?.name ?? "",

    startingXI:
      (item.startXI ?? []).map(
        mapPlayer
      ),

    substitutes:
      (item.substitutes ?? []).map(
        mapPlayer
      ),
  }));
}

function mapPlayer(
  player: any
): LineupPlayer {
  const p =
    player.player ?? player;

  return {
    id:
      p.id,

    name:
      p.name,

    number:
      p.number,

    position:
      p.pos,

    grid:
      p.grid,

    captain:
      Boolean(
        p.captain
      ),
  };
}