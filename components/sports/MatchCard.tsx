// components/sports/MatchCard.tsx

import type { Match } from "@/lib/football/types/match";

import { FootballFixtureCard } from "@/src/design-system";

interface Props {
  match: Match;
}

export default function MatchCard({
  match,
}: Props) {
  return (
    <FootballFixtureCard
      href={`/match/${match.id}`}
      competition={match.competition.name}
      homeTeam={{
        name: match.homeTeam.name,
        crest: match.homeTeam.crest,
      }}
      awayTeam={{
        name: match.awayTeam.name,
        crest: match.awayTeam.crest,
      }}
      homeScore={match.score.home}
      awayScore={match.score.away}
      status={match.status}
      kickoff={new Date(match.kickoff).toLocaleString()}
    />
  );
}