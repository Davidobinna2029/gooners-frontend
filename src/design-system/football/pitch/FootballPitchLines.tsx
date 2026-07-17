// src/design-system/football/pitch/FootballPitchLines.tsx

export default function FootballPitchLines() {
  return (
    <>
      {/* Outer Boundary */}
      <div className="absolute inset-4 rounded-xl border-2 border-white/80" />

      {/* Halfway Line */}
      <div className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 bg-white/80" />

      {/* Centre Circle */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-24
          w-24
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border-2
          border-white/80
        "
      />

      {/* Centre Spot */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-2
          w-2
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white
        "
      />

      {/* Top Penalty Area */}
      <div
        className="
          absolute
          left-1/2
          top-4
          h-20
          w-48
          -translate-x-1/2
          border-2
          border-t-0
          border-white/80
        "
      />

      {/* Bottom Penalty Area */}
      <div
        className="
          absolute
          bottom-4
          left-1/2
          h-20
          w-48
          -translate-x-1/2
          border-2
          border-b-0
          border-white/80
        "
      />

      {/* Top Six-yard Box */}
      <div
        className="
          absolute
          left-1/2
          top-4
          h-10
          w-24
          -translate-x-1/2
          border-2
          border-t-0
          border-white/80
        "
      />

      {/* Bottom Six-yard Box */}
      <div
        className="
          absolute
          bottom-4
          left-1/2
          h-10
          w-24
          -translate-x-1/2
          border-2
          border-b-0
          border-white/80
        "
      />

      {/* Top Penalty Spot */}
      <div
        className="
          absolute
          left-1/2
          top-20
          h-2
          w-2
          -translate-x-1/2
          rounded-full
          bg-white
        "
      />

      {/* Bottom Penalty Spot */}
      <div
        className="
          absolute
          bottom-20
          left-1/2
          h-2
          w-2
          -translate-x-1/2
          rounded-full
          bg-white
        "
      />
    </>
  );
}