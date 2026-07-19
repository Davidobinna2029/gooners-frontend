"use client";

interface CardAnimationProps {
  type: "yellow" | "red";
}

export default function CardAnimation({
  type,
}: CardAnimationProps) {
  const isRed = type === "red";

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className={`
          h-24
          w-16
          rounded-md
          shadow-2xl
          animate-bounce
          ${isRed ? "bg-red-600" : "bg-yellow-400"}
        `}
      />
    </div>
  );
}