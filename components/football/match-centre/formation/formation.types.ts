export interface FormationPlayer {

  id: number;

  name: string;

  shirtNumber?: number;

  position: string;

  row: number;

  column: number;

}

export interface FormationTeam {

  team: "home" | "away";

  formation: string;

  players: FormationPlayer[];

}