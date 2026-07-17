// src/design-system/football/pitch/FootballBall.tsx

interface FootballBallProps {
  x: number;
  y: number;
  visible?: boolean;
}

export default function FootballBall({
  x,
  y,
  visible = true,
}: FootballBallProps) {
  if (!visible) return null;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      <div
        className="
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-full
          border
          border-gray-700
          bg-white
          text-[10px]
          shadow-lg
        "
      >
        ⚽
      </div>
    </div>
  );
}