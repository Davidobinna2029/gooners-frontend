"use client";

import MatchMomentum from "./MatchMomentum";
import ShotMap from "./ShotMap";
import HeatMap from "./HeatMap";
import PassNetwork from "./PassNetwork";
import WinProbability from "./WinProbability";
import PlayerRatings from "./PlayerRatings";
import ExpectedThreat from "./ExpectedThreat";

import PressureMeter
  from "@/src/design-system/football/momentum/PressureMeter";

import {
  calculateMomentum,
} from "@/src/lib/football/momentum/momentumEngine";

import {
  calculateExpectedGoals,
} from "@/src/lib/football/xg/xgEngine";

import {
  calculateBigChances,
} from "@/src/lib/football/analytics/bigChancesEngine";

import {
  calculateTerritory,
} from "@/src/lib/football/analytics/territoryEngine";

import {
  calculateExpectedThreat,
} from "@/src/lib/football/analytics/xTEngine";

import {
  buildShotMap,
} from "@/src/lib/football/analytics/shotMapEngine";

import {
  buildHeatMap,
} from "@/src/lib/football/analytics/heatMapEngine";

import {
  buildPassNetwork,
} from "@/src/lib/football/analytics/passNetworkEngine";

import {
  calculateWinProbability,
} from "@/src/lib/football/analytics/winProbabilityEngine";

import {
  calculatePlayerRatings,
} from "@/src/lib/football/analytics/playerRatingEngine";

import {
  useLiveStore,
} from "@/src/lib/football/live/liveStore";

interface Props {
  homeTeamId: number;
  awayTeamId: number;
}

export default function MatchAnalyticsDashboard({
  homeTeamId,
  awayTeamId,
}: Props) {

  const events =
    useLiveStore(
      (state) => state.events
    );

  const match =
    useLiveStore(
      (state) => state.match
    );

  const momentum =
    calculateMomentum(
      events,
      homeTeamId,
      awayTeamId
    );

  const xg =
    calculateExpectedGoals(
      events,
      homeTeamId,
      awayTeamId
    );

  const bigChances =
    calculateBigChances(
      events,
      homeTeamId,
      awayTeamId
    );

  const territory =
    calculateTerritory(
      events,
      homeTeamId,
      awayTeamId
    );

  const xT =
    calculateExpectedThreat(
      events,
      homeTeamId,
      awayTeamId
    );

  const shots =
    buildShotMap(
      events,
      homeTeamId,
      awayTeamId
    );

  const heatMap =
    buildHeatMap(
      events,
      homeTeamId
    );

  const passNetwork =
    buildPassNetwork(
      events,
      homeTeamId
    );

  const ratings =
    calculatePlayerRatings(
      events
    );

  const probability =
    calculateWinProbability(
      events,
      homeTeamId,
      awayTeamId,
      match?.score.home ?? 0,
      match?.score.away ?? 0,
      match?.minute ?? 0
    );

  return (

    <section
      className="
        mb-8
        rounded-xl
        border
        bg-white
        p-5
        shadow-sm
      "
    >

      <h2
        className="
          mb-5
          text-lg
          font-bold
        "
      >
        Live Analytics
      </h2>

      <div className="space-y-6">

        <WinProbability
          home={probability.homeWin}
          draw={probability.draw}
          away={probability.awayWin}
        />

        <MatchMomentum
          homeTeamId={homeTeamId}
          awayTeamId={awayTeamId}
        />

        <PressureMeter
          pressure={momentum.home}
        />

        <AnalyticsCard
          title="Expected Goals (xG)"
          home={xg.home}
          away={xg.away}
        />

        <AnalyticsCard
          title="Big Chances"
          home={bigChances.home}
          away={bigChances.away}
        />

        <AnalyticsCard
          title="Territory Control %"
          home={`${territory.home}%`}
          away={`${territory.away}%`}
        />

        <AnalyticsCard
          title="Expected Threat (xT)"
          home={xT.home}
          away={xT.away}
        />

        <ExpectedThreat
          home={xT.home}
          away={xT.away}
        />

        <ShotMap
          shots={shots}
          homeTeamId={homeTeamId}
        />

        <HeatMap
          points={heatMap.points}
        />

        <PassNetwork
          network={passNetwork}
        />

        <PlayerRatings
          ratings={ratings}
        />

      </div>

    </section>

  );

}

function AnalyticsCard({
  title,
  home,
  away,
}: {
  title: string;
  home: string | number;
  away: string | number;
}) {

  return (

    <div
      className="
        rounded-xl
        border
        bg-neutral-50
        p-4
      "
    >

      <h3
        className="
          mb-3
          font-semibold
        "
      >
        {title}
      </h3>

      <div
        className="
          flex
          justify-between
          text-center
        "
      >

        <div>

          <p
            className="
              text-sm
              text-neutral-500
            "
          >
            Home
          </p>

          <p
            className="
              text-2xl
              font-bold
            "
          >
            {home}
          </p>

        </div>

        <div>

          <p
            className="
              text-sm
              text-neutral-500
            "
          >
            Away
          </p>

          <p
            className="
              text-2xl
              font-bold
            "
          >
            {away}
          </p>

        </div>

      </div>

    </div>

  );

}