// components/match/MatchScoreboard.tsx

import type { Match } from "@/lib/football/types/match";

import MatchClock from "@/components/sports/MatchClock";

import {
  FootballHero,
  FootballScore,
  FootballTeamHeader,
} from "@/src/design-system";

interface Props {
  match: Match;
}

export default function MatchScoreboard({
  match,
}: Props) {
  return (
    <FootballHero
      title={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
      subtitle={match.competition.name}
      status={match.status}
      home={
        <FootballTeamHeader
          name={match.homeTeam.name}
          crest={match.homeTeam.crest}
          size="lg"
        />
      }
      center={
        <FootballScore
          home={match.score.home}
          away={match.score.away}
          live={[
            "LIVE",
            "IN_PLAY",
            "PAUSED",
          ].includes(match.status)}
          size="lg"
        />
      }
      away={
        <FootballTeamHeader
          name={match.awayTeam.name}
          crest={match.awayTeam.crest}
          size="lg"
        />
      }
      footer={
        <div className="flex items-center justify-center">
          <MatchClock match={match} />
        </div>
      }
    />
  );
}