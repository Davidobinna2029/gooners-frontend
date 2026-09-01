import type {
  MatchMomentum,
  MomentumWindow,
  PressureWave,
  MomentumShift,
  MomentumTeam,
} from "@/lib/football/types/matchEvents";

export interface MomentumViewModel {

  overallWinner: MomentumTeam;

  confidence: number;

  timeline: MomentumWindow[];

  pressureWaves: PressureWave[];

  swings: MomentumShift[];

}

export function mapMomentum(
  momentum: MatchMomentum
): MomentumViewModel {

  return {

    overallWinner: momentum.overallWinner,

    confidence: momentum.confidence,

    timeline: momentum.timeline,

    pressureWaves: momentum.pressureWaves,

    swings: momentum.swings,

  };

}