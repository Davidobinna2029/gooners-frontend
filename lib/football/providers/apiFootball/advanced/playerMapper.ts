// lib/football/providers/apiFootball/advanced/playerMapper.ts

import type {
  PlayerProfile,
} from "../../../advancedProvider";

export function mapApiFootballPlayers(
  response: any[]
): PlayerProfile[] {
  return response.map((item) => {
    const player =
      item.player;

    const statistics =
      item.statistics?.[0];

    return {
      id:
        player.id,

      name:
        player.name,

      firstname:
        player.firstname,

      lastname:
        player.lastname,

      age:
        player.age,

      nationality:
        player.nationality,

      photo:
        player.photo,

      position:
        statistics?.games?.position ??
        null,

      appearances:
        statistics?.games?.appearences ??
        0,

      minutes:
        statistics?.games?.minutes ??
        0,

      goals:
        statistics?.goals?.total ??
        0,

      assists:
        statistics?.goals?.assists ??
        0,

      yellowCards:
        statistics?.cards?.yellow ??
        0,

      redCards:
        statistics?.cards?.red ??
        0,
    };
  });
}