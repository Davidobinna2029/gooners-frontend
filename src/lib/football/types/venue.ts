import type {
  ID,
} from "./common";

export interface FootballVenue {
  id: ID;

  name: string;

  city?: string;

  country?: string;

  capacity?: number;
}