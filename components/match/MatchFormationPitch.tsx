// components/match/MatchFormationPitch.tsx

import type {
  FootballLineup,
} from "@/src/lib/football/types";

import {
  FootballPitch,
} from "@/src/design-system";


import type {
  FootballPlayer,
} from "@/src/lib/football/types";


interface Props {
  team: FootballLineup;
}


export default function MatchFormationPitch({
  team,
}: Props) {

  const players: FootballPlayer[] =
    team.startingXI.map((player) => ({
      id: player.id,
      name: player.name,
      number: player.number,
      position: player.position,
      captain: player.captain,
      starter: true,
      teamId: team.teamId,
    }));


  return (
    <FootballPitch

      formation={
        team.formation
      }

      players={
        players
      }

      showBall={
        false
      }

    />
  );
}