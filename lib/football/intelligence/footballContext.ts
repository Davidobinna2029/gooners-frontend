import type { MatchIntelligence } from "./matchIntelligence";

import type {
  ShotEvent,
} from "./xgEngine";

export interface FootballContext {

  intelligence: MatchIntelligence;

  shots: ShotEvent[];

}

export function buildFootballContext(

  intelligence: MatchIntelligence,

  shots: ShotEvent[] = []

): FootballContext {

  return {

    intelligence,

    shots,

  };

}