import type {
  MatchIntelligence,
} from "@/lib/football/intelligence/matchIntelligence";

export interface MatchFactsViewModel {

  competition?: string;

  venue?: string;

  kickoff?: string;

  round?: string;

  score: {

    home: number;

    away: number;

  };

  homeTeam: {

    id: number;

    name: string;

    formation?: string;

  };

  awayTeam: {

    id: number;

    name: string;

    formation?: string;

  };

}

export function mapMatchFacts(
  intelligence: MatchIntelligence
): MatchFactsViewModel {

  return {

    competition: intelligence.metadata.competition,

    venue: intelligence.metadata.venue,

    kickoff: intelligence.metadata.kickoff,

    round: intelligence.metadata.round,

    score: intelligence.score,

    homeTeam: {

      id: intelligence.home.information.id,

      name: intelligence.home.information.name,

      formation:
        intelligence.home.information.formation,

    },

    awayTeam: {

      id: intelligence.away.information.id,

      name: intelligence.away.information.name,

      formation:
        intelligence.away.information.formation,

    },

  };

}