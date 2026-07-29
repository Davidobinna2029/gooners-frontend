import type {
  FormationPlayer,
} from "./formation.types";

import {
  getGridPosition,
} from "./formation.utils";

interface Props {

  player: FormationPlayer;

}

export default function FormationPlayer({

  player,

}: Props) {

  const position =
    getGridPosition(player);

  return (

    <div
      style={position}
      className="flex flex-col items-center justify-center"
    >

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">

        {player.shirtNumber ?? "?"}

      </div>

      <span className="mt-2 text-xs text-center font-medium">

        {player.name}

      </span>

    </div>

  );

}