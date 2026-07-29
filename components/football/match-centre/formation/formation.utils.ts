import type {
  FormationPlayer,
} from "./formation.types";

export function getGridPosition(
  player: FormationPlayer
) {

  return {

    gridRow:
      player.row,

    gridColumn:
      player.column,

  };

}