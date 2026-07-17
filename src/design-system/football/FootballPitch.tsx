interface FootballPitchProps {
  children: React.ReactNode;
}

export default function FootballPitch({
  children,
}: FootballPitchProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-green-700 bg-gradient-to-b from-green-700 to-green-800 p-8">

      {/* halfway line */}

      <div className="absolute left-0 right-0 top-1/2 h-px bg-white/30" />

      {/* centre circle */}

      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />

      {/* penalty boxes */}

      <div className="absolute left-1/2 top-0 h-24 w-56 -translate-x-1/2 border border-t-0 border-white/30" />

      <div className="absolute bottom-0 left-1/2 h-24 w-56 -translate-x-1/2 border border-b-0 border-white/30" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}