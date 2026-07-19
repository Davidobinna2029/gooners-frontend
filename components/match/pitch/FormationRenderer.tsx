"use client";

import {
  buildFormation,
  type FormationPlayer,
} from "@/src/lib/football/formation";

import FootballPitchPlayer from "@/src/design-system/football/pitch/FootballPitchPlayer";

interface FormationRendererProps {
  formation: string;

  players: FormationPlayer[];

  goalScorers?: number[];

  yellowCards?: number[];

  redCards?: number[];

  pulsePlayers?: number[];
}

export default function FormationRenderer({
  formation,
  players,
  goalScorers = [],
  yellowCards = [],
  redCards = [],
  pulsePlayers = [],
}: FormationRendererProps) {

  const positionedPlayers =
    buildFormation(
      formation,
      players
    );


  return (
    <>
      {positionedPlayers.map((player) => (

        <FootballPitchPlayer
          key={player.id}
          player={player}

          goal={
            goalScorers.includes(
              player.id
            )
          }

          yellowCard={
            yellowCards.includes(
              player.id
            )
          }

          redCard={
            redCards.includes(
              player.id
            )
          }

          pulse={
            pulsePlayers.includes(
              player.id
            )
          }

        />

      ))}
    </>
  );
}