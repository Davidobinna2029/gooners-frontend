// components/match/MatchCentre.tsx

import type { Match } from "@/lib/football/types/match";

import MatchHeader from "./MatchHeader";
import MatchScoreboard from "./MatchScoreboard";
import MatchTabs from "./MatchTabs";
import MatchTimeline from "./MatchTimeline";
import MatchStatistics from "./MatchStatistics";
import MatchLineups from "./MatchLineups";
import MatchNews from "./MatchNews";
import MatchFacts from "./MatchFacts";

import { resolveAdvancedProvider } from "@/lib/football/advancedResolver";

interface Props {
  match: Match;
}

export default async function MatchCentre({
  match,
}: Props) {
  const advanced = resolveAdvancedProvider();

  const [
    events,
    statistics,
    lineups,
    headToHead,
  ] = await Promise.all([
    advanced.getEvents(match.id),
    advanced.getStatistics(match.id),
    advanced.getLineups(match.id),
    advanced.getHeadToHead(
      match.homeTeam.id,
      match.awayTeam.id
    ),
  ]);

  return (
    <main className="match-centre">
      <div className="container">
        <MatchHeader match={match} />

        <MatchScoreboard match={match} />

        <MatchTabs />

        <div className="match-centre-grid">
          <section className="match-centre-main">
            <MatchTimeline
              match={match}
              events={events}
            />

            <MatchStatistics
              statistics={statistics}
            />

            <MatchLineups
              lineups={lineups}
            />
          </section>

          <aside className="match-centre-sidebar">
            <MatchFacts
              match={match}
              headToHead={headToHead}
            />

            <MatchNews
              match={match}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}