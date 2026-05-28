import Link from "next/link";

export type Match = {
  id: number;
  date?: string;
  status?: string;
  league?: {
    name?: string;
  };
  teams?: {
    home?: {
      name?: string;
      score?: number;
    };
    away?: {
      name?: string;
      score?: number;
    };
  };
};

interface Props {
  nextMatch?: Match | null;
}

export default function MatchHero({ nextMatch }: Props) {
  if (!nextMatch) return null;

  const competition = nextMatch?.league?.name ?? "Premier League";

  const home = nextMatch?.teams?.home?.name ?? "Arsenal";
  const away = nextMatch?.teams?.away?.name ?? "Opponent";

  const date = nextMatch?.date ?? "TBD";

  return (
    <section className="match-hero">
      <div className="container">
        <div className="match-hero-card">

          <div className="match-hero-overlay">

            <span className="match-competition">
              {competition}
            </span>

            <h2>
              {home} <span>vs</span> {away}
            </h2>

            <p>Upcoming Match Coverage</p>

            <div className="match-meta">
              <span>{date}</span>
              <span>•</span>
              <span>Live Match Center</span>
            </div>

            <Link href="/fixtures" className="match-button">
              View Match Centre
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}