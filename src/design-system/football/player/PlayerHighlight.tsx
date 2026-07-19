// src/design-system/football/player/PlayerHighlight.tsx

import PlayerGlow from "./PlayerGlow";

interface Props {
  goal?: boolean;
  yellow?: boolean;
  red?: boolean;
}

export default function PlayerHighlight({
  goal,
  yellow,
  red,
}: Props) {
  if (goal) {
    return (
      <PlayerGlow
        active
        color="#22C55E"
      />
    );
  }

  if (yellow) {
    return (
      <PlayerGlow
        active
        color="#FACC15"
      />
    );
  }

  if (red) {
    return (
      <PlayerGlow
        active
        color="#DC2626"
      />
    );
  }

  return null;
}