import Link from "next/link";

import FootballCard from "./FootballCard";
import FootballScore from "./FootballScore";
import FootballTeamHeader from "./FootballTeamHeader";
import FootballBadge from "./FootballBadge";

interface Team {
  name: string;
  crest?: string | null;
}

interface FootballFixtureCardProps {
  href?: string;

  competition: string;

  homeTeam: Team;

  awayTeam: Team;

  homeScore: number | null;

  awayScore: number | null;

  status: string;

  kickoff?: string;
}

export default function FootballFixtureCard({
  href,
  competition,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  kickoff,
}: FootballFixtureCardProps) {
  const card = (
    <FootballCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {competition}
        </span>

        <FootballBadge status={status} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
        <FootballTeamHeader
          name={homeTeam.name}
          crest={homeTeam.crest}
          size="md"
        />

        <FootballScore
          home={homeScore}
          away={awayScore}
          live={[
            "LIVE",
            "IN_PLAY",
            "PAUSED",
          ].includes(status)}
        />

        <FootballTeamHeader
          name={awayTeam.name}
          crest={awayTeam.crest}
          size="md"
        />
      </div>

      {kickoff && (
        <div className="mt-5 text-center text-sm text-gray-500">
          {kickoff}
        </div>
      )}
    </FootballCard>
  );

  if (!href) return card;

  return (
    <Link
      href={href}
      className="block"
    >
      {card}
    </Link>
  );
}