// components/match/MatchCentre.tsx

import type {
  Match,
} from "@/lib/football/types/match";

import MatchHeader from "./MatchHeader";
import MatchScoreboard from "./MatchScoreboard";
import MatchTabs from "./MatchTabs";
import MatchTimeline from "./MatchTimeline";
import MatchMomentum from "./MatchMomentum";
import MatchStatistics from "./MatchStatistics";
import MatchLineups from "./MatchLineups";
import MatchNews from "./MatchNews";
import MatchFacts from "./MatchFacts";

import MatchAnimationController from "./MatchAnimationController";

import {
  getCachedMatchCentreData,
} from "@/src/lib/football/match/matchCache";

import {
  lineupToFormationPlayers,
} from "@/src/lib/football/formation";

interface Props {
  match: Match;
}

export default async function MatchCentre({
  match,
}: Props) {

  const {
    events,
    statistics,
    lineups,
    headToHead,
  } =
    await getCachedMatchCentreData(
      match.id,
      match.homeTeam.id,
      match.awayTeam.id
    );

  /**
   * Convert lineup domain data
   * into pitch player format.
   */
  const pitchLineup =
    lineups.length > 0
      ? lineupToFormationPlayers(
          lineups[0]
        )
      : [];

  const formation =
    lineups.length > 0
      ? lineups[0].formation
      : "4-3-3";

  return (

    <main className="match-centre">

      <div className="container">

        <MatchAnimationController
          match={match}
          events={events}
          players={pitchLineup}
          formation={formation}
        />

        <MatchHeader
          match={match}
        />

        <MatchScoreboard
          match={match}
        />

        <MatchTabs />

        <div className="match-centre-grid">

          <section className="match-centre-main">

            <MatchTimeline
              match={match}
              events={events}
            />

            <MatchMomentum
              homeTeamId={match.homeTeam.id}
              awayTeamId={match.awayTeam.id}
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