"use client";

import type { ReactNode } from "react";

interface FootballPitchProps {
  children?: ReactNode;
}

export default function FootballPitch({
  children,
}: FootballPitchProps) {
  return (
    <div className="relative mx-auto w-full max-w-4xl aspect-[68/105] overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-b from-green-700 via-green-600 to-green-700 shadow-2xl">

      {/* Grass stripes */}
      <div className="absolute inset-0">
        {Array.from({ length: 14 }).map((_, index) => (
          <div
            key={index}
            className={`h-[7.15%] ${
              index % 2 === 0
                ? "bg-green-700/40"
                : "bg-green-600/20"
            }`}
          />
        ))}
      </div>

      {/* Centre line */}
      <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-white" />

      {/* Centre circle */}
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" />

      {/* Centre spot */}
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

      {/* Top penalty area */}
      <div className="absolute left-1/2 top-0 h-[16%] w-[58%] -translate-x-1/2 border-2 border-t-0 border-white" />

      {/* Top six-yard box */}
      <div className="absolute left-1/2 top-0 h-[7%] w-[28%] -translate-x-1/2 border-2 border-t-0 border-white" />

      {/* Top penalty spot */}
      <div className="absolute left-1/2 top-[11%] h-2 w-2 -translate-x-1/2 rounded-full bg-white" />

      {/* Bottom penalty area */}
      <div className="absolute bottom-0 left-1/2 h-[16%] w-[58%] -translate-x-1/2 border-2 border-b-0 border-white" />

      {/* Bottom six-yard box */}
      <div className="absolute bottom-0 left-1/2 h-[7%] w-[28%] -translate-x-1/2 border-2 border-b-0 border-white" />

      {/* Bottom penalty spot */}
      <div className="absolute bottom-[11%] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white" />

      {/* Top goal */}
      <div className="absolute left-1/2 top-0 h-2 w-[16%] -translate-x-1/2 border-x-2 border-b-2 border-white bg-transparent" />

      {/* Bottom goal */}
      <div className="absolute bottom-0 left-1/2 h-2 w-[16%] -translate-x-1/2 border-x-2 border-t-2 border-white bg-transparent" />

      {/* Dynamic layers */}
      <div className="absolute inset-0">
        {children}
      </div>

    </div>
  );
}