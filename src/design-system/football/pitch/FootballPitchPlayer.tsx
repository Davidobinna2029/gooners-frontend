// src/design-system/football/pitch/FootballPitchPlayer.tsx

import type {
  PositionedPlayer,
} from "@/src/lib/football/formation";

import FootballShirt from "@/src/design-system/football/shirt/FootballShirt";

import {
  PlayerGlow,
  PlayerHighlight,
  PlayerPulse,
} from "@/src/design-system/football/player";

import FootballPlayerBadge from "./FootballPlayerBadge";

import type {
  PlayerStatus,
} from "./playerStatus";

interface FootballPitchPlayerProps {
  player: PositionedPlayer;

  showNumber?: boolean;

  shirtColor?: string;
  shirtTextColor?: string;

  status?: PlayerStatus;

  rating?: number;

  goal?: boolean;
  yellowCard?: boolean;
  redCard?: boolean;
  pulse?: boolean;
}

export default function FootballPitchPlayer({
  player,
  showNumber = true,
  shirtColor = "#DC2626",
  shirtTextColor = "#FFFFFF",
  status = "normal",
  rating,
  goal = false,
  yellowCard = false,
  redCard = false,
  pulse = false,
}: FootballPitchPlayerProps) {

  return (

    <div
      className="
        absolute
        -translate-x-1/2
        -translate-y-1/2
        transition-all
        duration-500
        ease-in-out
      "
      style={{
        left: `${player.x}%`,
        top: `${player.y}%`,
      }}
    >

      <PlayerPulse active={pulse}>

        <div className="flex flex-col items-center">

          <div className="relative">

            <PlayerHighlight
              goal={goal}
              yellow={yellowCard}
              red={redCard}
            />

            <PlayerGlow
              active={goal}
              color="#EF4444"
            >

              <FootballShirt
                number={
                  showNumber
                    ? player.number
                    : undefined
                }
                color={shirtColor}
                textColor={shirtTextColor}
                size={46}
              />

            </PlayerGlow>

            <FootballPlayerBadge
              status={status}
            />

          </div>

          <div
            className="
              mt-2
              max-w-[76px]
              rounded-md
              bg-black/70
              px-2
              py-1
              text-center
              text-[10px]
              font-semibold
              leading-tight
              text-white
              shadow-md
            "
          >
            {player.name}
          </div>

          {rating !== undefined && (

            <div
              className="
                mt-1
                rounded-full
                bg-emerald-500
                px-2
                py-0.5
                text-[10px]
                font-bold
                text-white
                shadow
              "
            >
              ★ {rating.toFixed(1)}
            </div>

          )}

        </div>

      </PlayerPulse>

    </div>

  );

}