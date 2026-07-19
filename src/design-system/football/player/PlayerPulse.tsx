// src/design-system/football/player/PlayerPulse.tsx

import type { ReactNode } from "react";

interface Props {
  active?: boolean;
  children?: ReactNode;
}

export default function PlayerPulse({
  active = false,
  children,
}: Props) {
  return (
    <div
      className={
        active
          ? "animate-pulse"
          : ""
      }
    >
      {children}
    </div>
  );
}