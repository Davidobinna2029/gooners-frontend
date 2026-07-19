"use client";

interface BallAnimationProps {
  x: number;
  y: number;
  visible?: boolean;
}

export default function BallAnimation({
  x,
  y,
  visible = true,
}: BallAnimationProps) {
  return (
    <div
      className={`
        absolute
        -translate-x-1/2
        -translate-y-1/2
        transition-all
        duration-700
        ease-in-out
        ${visible ? "opacity-100" : "opacity-0"}
      `}
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
          border-gray-300
          bg-white
          shadow-lg
        "
      >
        ⚽
      </div>
    </div>
  );
}