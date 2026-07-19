import type {
  Injury,
} from "@/lib/football/advancedProvider";


export interface FootballInjury {
  playerId: number;

  player: string;

  teamId: number;

  injury: string;

  reason?: string;

  expectedReturn?: string;
}


export function adaptInjury(
  injury: Injury
): FootballInjury {

  return {
    playerId: injury.playerId,

    player: injury.player,

    teamId: injury.teamId,

    injury: injury.injury,

    reason: injury.reason,

    expectedReturn:
      injury.expectedReturn,
  };
}