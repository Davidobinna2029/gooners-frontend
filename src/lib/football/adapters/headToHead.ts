import type {
  HeadToHeadMatch,
} from "@/lib/football/advancedProvider";


export interface FootballHeadToHead {
  id: number;

  date: string;

  competition: string;

  homeTeam: string;

  awayTeam: string;

  homeScore: number;

  awayScore: number;
}


export function adaptHeadToHead(
  match: HeadToHeadMatch
): FootballHeadToHead {

  return {
    id: match.id,

    date: match.date,

    competition: match.competition,

    homeTeam: match.homeTeam,

    awayTeam: match.awayTeam,

    homeScore: match.homeScore,

    awayScore: match.awayScore,
  };
}