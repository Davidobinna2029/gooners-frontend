// lib/football/providers/apiFootball/advanced/injuryMapper.ts

import type {
  Injury,
} from "../../../advancedProvider";

export function mapApiFootballInjuries(
  response: any[]
): Injury[] {
  return response.map((item) => ({
    playerId:
      item.player.id,

    teamId:
      item.team.id,

    player:
      item.player.name,

    injury:
      item.player.reason ??
      item.player.type ??
      "Unknown",
  }));
}