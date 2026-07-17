// src/design-system/football/pitch/FootballPitchPlayer.tsx

import { FootballShirt } from "@/src/design-system/football/shirt";

interface Props {
  name: string;
  number?: number;
  shirtColor?: string;
  textColor?: string;
  size?: number;
}

export default function FootballPitchPlayer({
  name,
  number,
  shirtColor = "#DC2626",
  textColor = "#FFFFFF",
  size = 48,
}: Props) {
  return (
    <div className="flex flex-col items-center">
      <FootballShirt
        number={number}
        color={shirtColor}
        textColor={textColor}
        size={size}
      />

      <span className="mt-2 max-w-[72px] text-center text-xs font-medium text-white drop-shadow">
        {name}
      </span>
    </div>
  );
}