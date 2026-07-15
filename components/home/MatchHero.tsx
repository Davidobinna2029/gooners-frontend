import Link from "next/link";

import MatchCountdown from "./MatchCountdown";

import type { Match } from "@/lib/football/types/match";

interface Props {
  nextMatch?: Match | null;
}

export default function MatchHero({
  nextMatch,
}: Props) {
  if (!nextMatch) return null;

  const competition =
    nextMatch.competition?.name ??
    "Premier League";

  const home =
    nextMatch.homeTeam?.name ??
    "Arsenal";

  const away =
    nextMatch.awayTeam?.name ??
    "Opponent";

  const kickoff =
    nextMatch.kickoff ??
    new Date().toISOString();

  const status =
    nextMatch.status ?? "SCHEDULED";

  const coverageText =
    ["LIVE", "IN_PLAY", "PAUSED"].includes(status)
      ? "Live Match Coverage"
      : status === "FINISHED"
      ? "Match Report & Analysis"
      : "Upcoming Match Coverage";

  return (
    <section className="match-hero">
      <div className="container">
        <div className="match-hero-card">
          <div className="match-hero-overlay">
            <span className="match-competition">
              {competition}
            </span>

            <h2>
              {home}
              <span> vs </span>
              {away}
            </h2>

            <p>{coverageText}</p>

            <MatchCountdown
              kickoff={kickoff}
            />

            <div className="match-meta">
              <span>
                {new Date(
                  kickoff
                ).toLocaleString()}
              </span>

              <span>•</span>

              <span>
                Live Match Centre
              </span>
            </div>

            <Link
              href="/fixtures"
              className="match-button"
            >
              View Match Centre
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}