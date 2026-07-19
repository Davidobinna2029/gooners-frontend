// src/design-system/football/pitch/FootballPitch.tsx

import type {
  FootballPlayer,
} from "@/src/lib/football/types";

import type {
  LiveMatchState,
} from "@/src/lib/football/live";

import {
  MatchAnimationEngine,
  type AnimationEvent,
} from "@/src/design-system/football/animation";

import FormationRenderer from "@/components/match/pitch/FormationRenderer";

import styles from "./FootballPitch.module.css";

import FootballBall from "./FootballBall";
import FootballGoal from "./FootballGoal";
import FootballPitchLines from "./FootballPitchLines";


interface FootballPitchProps {

  formation: string;

  players: FootballPlayer[];

  ballPosition?: {
    x: number;
    y: number;
  };

  showBall?: boolean;

  animationEvents?: AnimationEvent[];

  liveState?: LiveMatchState;

}


export default function FootballPitch({
  formation,
  players,
  ballPosition,
  showBall = false,
  animationEvents = [],
}: FootballPitchProps) {


  return (

    <div className={styles.pitch}>


      {/* Pitch Markings */}

      <FootballPitchLines />



      {/* Goals */}

      <FootballGoal side="top" />

      <FootballGoal side="bottom" />



      {/* Ball */}

      {ballPosition && (

        <FootballBall

          x={ballPosition.x}

          y={ballPosition.y}

          visible={showBall}

        />

      )}



      {/* Players */}

      <FormationRenderer

        formation={formation}

        players={players}

      />



      {/* Animation Layer */}

      <MatchAnimationEngine

        events={animationEvents}

      />


    </div>

  );

}