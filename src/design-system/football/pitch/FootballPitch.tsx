// src/design-system/football/pitch/FootballPitch.tsx

import {
  buildFormation,
  type FormationPlayer,
} from "@/src/lib/football/formation";

import styles from "./FootballPitch.module.css";

import FootballBall from "./FootballBall";
import FootballGoal from "./FootballGoal";
import FootballPitchLines from "./FootballPitchLines";
import FootballPitchPlayer from "./FootballPitchPlayer";

interface FootballPitchProps {
  formation: string;
  players: FormationPlayer[];

  /**
   * Optional live ball position.
   * Coordinates are percentages (0–100).
   */
  ballPosition?: {
    x: number;
    y: number;
  };

  /**
   * Whether to display the ball.
   */
  showBall?: boolean;
}

export default function FootballPitch({
  formation,
  players,
  ballPosition,
  showBall = false,
}: FootballPitchProps) {
  const positionedPlayers = buildFormation(
    formation,
    players
  );

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
      {positionedPlayers.map((player) => (
        <FootballPitchPlayer
          key={player.player.id}
          player={player}
        />
      ))}
    </div>
  );
}