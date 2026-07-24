export interface MatchViewModel {
  id: string;

  competition: string;

  homeTeam: string;

  awayTeam: string;

  homeScore: number;

  awayScore: number;

  status: string;

  venue: string;

  referee?: string;

  attendance?: number;

  kickoff: string;

  matchday?: number;
}