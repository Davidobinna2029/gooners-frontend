// src/design-system/football/pitch/FootballPitchPlayer.tsx

import type { PositionedPlayer } from "@/src/lib/football/formation";

import FootballShirt from "@/src/design-system/football/shirt/FootballShirt";

import FootballPlayerBadge from "./FootballPlayerBadge";
import type { PlayerStatus } from "./playerStatus";

interface FootballPitchPlayerProps {
  player: PositionedPlayer;
  showNumber?: boolean;
  shirtColor?: string;
  shirtTextColor?: string;
  status?: PlayerStatus;
  rating?: number;
}

export default function FootballPitchPlayer({
  player,
  showNumber = true,
  shirtColor = "#DC2626",
  shirtTextColor = "#FFFFFF",
  status = "normal",
  rating,
}: FootballPitchPlayerProps) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${player.coordinate.x}%`,
        top: `${player.coordinate.y}%`,
      }}
    >
      <div className="flex flex-col items-center">
        {/* Shirt + Badge */}
        <div className="relative">
          <FootballShirt
            number={
              showNumber
                ? player.player.number
                : undefined
            }
            color={shirtColor}
            textColor={shirtTextColor}
            size={46}
          />

          <FootballPlayerBadge status={status} />
        </div>

        {/* Player Name */}
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
          {player.player.name}
        </div>

        {/* Rating */}
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
    </div>
  );
}