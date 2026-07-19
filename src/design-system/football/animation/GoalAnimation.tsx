"use client";

export default function GoalAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center animate-pulse">
      <div
        className="
          rounded-2xl
          bg-green-600/90
          px-8
          py-4
          text-4xl
          font-extrabold
          tracking-wide
          text-white
          shadow-2xl
        "
      >
        ⚽ GOAL!
      </div>
    </div>
  );
}