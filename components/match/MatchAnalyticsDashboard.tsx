"use client";

import MatchMomentum from "./MatchMomentum";
import ShotMap from "./ShotMap";
import HeatMap from "./HeatMap";
import PassNetwork from "./PassNetwork";
import WinProbability from "./WinProbability";
import PlayerRatings from "./PlayerRatings";
import ExpectedThreat from "./ExpectedThreat";
import ExpectedAssists
  from "./ExpectedAssists";
import KeyPassChains
  from "./KeyPassChains";
import ShotCreatingActions
  from "./ShotCreatingActions";
import GoalCreatingActions
  from "./GoalCreatingActions";
import PossessionValue from "./PossessionValue";
import SequenceThreat from "./SequenceThreat";
import MatchInsights from "./MatchInsights";
import FormationTracker from "./FormationTracker";
import PressingIntensity from "./PressingIntensity";
import PPDA from "./PPDA";
import HighTurnovers from "./HighTurnovers";
import CounterPressRecoveries
  from "./CounterPressRecoveries";
import DefensiveActionsByThird
  from "./DefensiveActionsByThird";
import DefensiveCompactness
  from "./DefensiveCompactness";
import DefensiveLineHeight from "./DefensiveLineHeight";
import AttackingWidth from "./AttackingWidth";
import BallProgression from "./BallProgression";
import ProgressivePasses from "./ProgressivePasses";
import CarryDistance from "./CarryDistance";
import ProgressiveCarries from "./ProgressiveCarries";
import FinalThirdEntries from "./FinalThirdEntries";
import PenaltyAreaEntries from "./PenaltyAreaEntries";
import FieldTilt from "./FieldTilt";

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
  calculateExpectedAssists,
} from "@/src/lib/football/analytics/expectedAssistsEngine";

import {
  calculateKeyPassChains,
} from "@/src/lib/football/analytics/keyPassChainsEngine";

import {
  calculateShotCreatingActions,
} from "@/src/lib/football/analytics/shotCreatingActionsEngine";

import {
  calculateGoalCreatingActions,
} from "@/src/lib/football/analytics/goalCreatingActionsEngine";

import {
  calculatePossessionValue,
} from "@/src/lib/football/analytics/possessionValueEngine";

import {
  calculateSequenceThreat,
} from "@/src/lib/football/analytics/sequenceThreatEngine";

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
  generateInsights,
} from "@/src/lib/football/insights/insightsEngine";

import {
  buildFormationTimeline,
} from "@/src/lib/football/tactical/formationTracker";

import {
  calculatePressingIntensity,
} from "@/src/lib/football/tactical/pressingEngine";

import {
  calculatePPDA,
} from "@/src/lib/football/tactical/ppdaEngine";

import {
  calculateHighTurnovers,
} from "@/src/lib/football/tactical/highTurnoversEngine";

import {
  calculateCounterPressRecoveries,
} from "@/src/lib/football/tactical/counterPressRecoveriesEngine";

import {
  calculateDefensiveActionsByThird,
} from "@/src/lib/football/tactical/defensiveActionsByThirdEngine";

import {
  calculateDefensiveCompactness,
} from "@/src/lib/football/tactical/defensiveCompactnessEngine";

import {
  calculateDefensiveLineHeight,
} from "@/src/lib/football/tactical/defensiveLineEngine";

import {
  calculateAttackingWidth,
} from "@/src/lib/football/tactical/attackingWidthEngine";

import {
  calculateBallProgression,
} from "@/src/lib/football/tactical/ballProgressionEngine";

import {
  calculateProgressivePasses,
} from "@/src/lib/football/tactical/progressivePassesEngine";

import {
  calculateCarryDistance,
} from "@/src/lib/football/tactical/carryDistanceEngine";

import {
  calculateProgressiveCarries,
} from "@/src/lib/football/tactical/progressiveCarriesEngine";

import {
  calculateFinalThirdEntries,
} from "@/src/lib/football/tactical/finalThirdEntriesEngine";

import {
  calculatePenaltyAreaEntries,
} from "@/src/lib/football/tactical/penaltyAreaEntriesEngine";

import {
  calculateFieldTilt,
} from "@/src/lib/football/tactical/fieldTiltEngine";

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



  const expectedAssists =
    calculateExpectedAssists(
      events,
      homeTeamId,
      awayTeamId
    );



  const keyPassChains =
    calculateKeyPassChains(
      events,
      homeTeamId,
      awayTeamId
    );



  const shotCreatingActions =
    calculateShotCreatingActions(
      events,
      homeTeamId,
      awayTeamId
    );



  const goalCreatingActions =
    calculateGoalCreatingActions(
      events,
      homeTeamId,
      awayTeamId
    );



  const possessionValue =
    calculatePossessionValue(
      events,
      homeTeamId,
      awayTeamId
    );



  const sequenceThreat =
    calculateSequenceThreat(
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



  const insights =
    generateInsights({

      homeXG: xg.home,

      awayXG: xg.away,

      homeMomentum: momentum.home,

      awayMomentum: momentum.away,

      homeTerritory: territory.home,

      awayTerritory: territory.away,

      homeWinProbability:
        probability.homeWin,

      awayWinProbability:
        probability.awayWin,

    });



  const formationTimeline =
    buildFormationTimeline(
      events
    );



  const pressing =
    calculatePressingIntensity(
      events,
      homeTeamId,
      awayTeamId
    );



  const ppda =
    calculatePPDA(
      events,
      homeTeamId,
      awayTeamId
    );



  const highTurnovers =
    calculateHighTurnovers(
      events,
      homeTeamId,
      awayTeamId
    );



  const counterPress =
    calculateCounterPressRecoveries(
      events,
      homeTeamId,
      awayTeamId
    );



  const defensiveActions =
    calculateDefensiveActionsByThird(
      events,
      homeTeamId,
      awayTeamId
    );



  const defensiveCompactness =
    calculateDefensiveCompactness(
      events,
      homeTeamId,
      awayTeamId
    );



  const defensiveLine =
    calculateDefensiveLineHeight(
      events,
      homeTeamId,
      awayTeamId
    );



  const attackingWidth =
    calculateAttackingWidth(
      events,
      homeTeamId,
      awayTeamId
    );



  const ballProgression =
    calculateBallProgression(
      events,
      homeTeamId,
      awayTeamId
    );



  const progressivePasses =
    calculateProgressivePasses(
      events,
      homeTeamId,
      awayTeamId
    );



  const carryDistance =
    calculateCarryDistance(
      events,
      homeTeamId,
      awayTeamId
    );



  const progressiveCarries =
    calculateProgressiveCarries(
      events,
      homeTeamId,
      awayTeamId
    );



  const finalThirdEntries =
    calculateFinalThirdEntries(
      events,
      homeTeamId,
      awayTeamId
    );



  const penaltyAreaEntries =
    calculatePenaltyAreaEntries(
      events,
      homeTeamId,
      awayTeamId
    );



  const fieldTilt =
    calculateFieldTilt(
      events,
      homeTeamId,
      awayTeamId
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



        <MatchInsights
          insights={insights}
        />



        <FormationTracker
          timeline={formationTimeline}
        />



        <PressingIntensity
          home={pressing.home}
          away={pressing.away}
        />



        <PPDA
          home={ppda.home}
          away={ppda.away}
        />



        <HighTurnovers
          home={highTurnovers.home}
          away={highTurnovers.away}
        />



        <CounterPressRecoveries
          home={counterPress.home}
          away={counterPress.away}
        />



        <DefensiveActionsByThird
          home={defensiveActions.home}
          away={defensiveActions.away}
        />



        <DefensiveCompactness
          home={defensiveCompactness.home}
          away={defensiveCompactness.away}
        />



        <DefensiveLineHeight
          home={defensiveLine.home}
          away={defensiveLine.away}
        />



        <AttackingWidth
          home={attackingWidth.home}
          away={attackingWidth.away}
        />



        <BallProgression
          home={ballProgression.home}
          away={ballProgression.away}
        />



        <ProgressivePasses
          home={progressivePasses.home}
          away={progressivePasses.away}
        />



        <CarryDistance
          home={carryDistance.home}
          away={carryDistance.away}
        />



        <ProgressiveCarries
          home={progressiveCarries.home}
          away={progressiveCarries.away}
        />



        <FinalThirdEntries
          home={finalThirdEntries.home}
          away={finalThirdEntries.away}
        />



        <PenaltyAreaEntries
          home={penaltyAreaEntries.home}
          away={penaltyAreaEntries.away}
        />



        <FieldTilt
          home={fieldTilt.home}
          away={fieldTilt.away}
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



        <ExpectedAssists
          home={expectedAssists.home}
          away={expectedAssists.away}
        />



        <KeyPassChains
          home={keyPassChains.home}
          away={keyPassChains.away}
        />



        <ShotCreatingActions
          home={shotCreatingActions.home}
          away={shotCreatingActions.away}
        />



        <GoalCreatingActions
          home={goalCreatingActions.home}
          away={goalCreatingActions.away}
        />



        <PossessionValue
          home={possessionValue.home}
          away={possessionValue.away}
        />



        <SequenceThreat
          home={sequenceThreat.home}
          away={sequenceThreat.away}
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

          <p className="text-sm text-neutral-500">
            Home
          </p>


          <p className="text-2xl font-bold">
            {home}
          </p>

        </div>



        <div>

          <p className="text-sm text-neutral-500">
            Away
          </p>


          <p className="text-2xl font-bold">
            {away}
          </p>

        </div>



      </div>


    </div>

  );

}