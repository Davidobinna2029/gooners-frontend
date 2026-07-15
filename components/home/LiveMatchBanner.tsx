import Link from "next/link";

import { HomepageMode } from "@/lib/matchday/mode";
import type { Match } from "@/lib/football/types/match";

interface Props {
  mode: HomepageMode;
  match: Match | null;
}

export default function LiveMatchBanner({
  mode,
  match,
}: Props) {
  if (!match) return null;

  const home =
    match.homeTeam?.name ?? "Arsenal";

  const away =
    match.awayTeam?.name ?? "Opponent";

  const homeScore =
    match.score?.home ?? 0;

  const awayScore =
    match.score?.away ?? 0;

  const competition =
    match.competition?.name ??
    "Premier League";

  switch (mode) {
    case HomepageMode.LIVE_MATCH:
      return (
        <section className="live-match-banner live">
          <div className="container">
            <div className="banner-left">
              <span className="live-dot">
                🔴 LIVE
              </span>

              <strong>
                {competition}
              </strong>
            </div>

            <div className="banner-centre">
              <span>
                {home}
              </span>

              <strong>
                {homeScore} - {awayScore}
              </strong>

              <span>
                {away}
              </span>
            </div>

            <div className="banner-right">
              <Link href="/fixtures">
                Match Centre →
              </Link>
            </div>
          </div>
        </section>
      );

    case HomepageMode.MATCHDAY_PRE:
      return (
        <section className="live-match-banner prematch">
          <div className="container">
            <div className="banner-left">
              ⏳ Matchday
            </div>

            <div className="banner-centre">
              <strong>
                {home} vs {away}
              </strong>
            </div>

            <div className="banner-right">
              <Link href="/fixtures">
                Fixtures →
              </Link>
            </div>
          </div>
        </section>
      );

    case HomepageMode.FULL_TIME:
    case HomepageMode.POST_MATCH:
      return (
        <section className="live-match-banner fulltime">
          <div className="container">
            <div className="banner-left">
              ✅ FULL TIME
            </div>

            <div className="banner-centre">
              <strong>
                {homeScore} - {awayScore}
              </strong>
            </div>

            <div className="banner-right">
              <Link href="/news">
                Match Report →
              </Link>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}