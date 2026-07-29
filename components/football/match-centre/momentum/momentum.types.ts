export interface MomentumPoint {
  minute: number;
  home: number;
  away: number;
}

export interface MomentumSummary {
  homeControl: number;
  awayControl: number;

  homePeaks: number;
  awayPeaks: number;

  swings: number;
}