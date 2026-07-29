export interface PlayerRating {

  id: string;

  playerName: string;

  team: "home" | "away";

  rating: number;

  shirtNumber?: number;

  position?: string;

}