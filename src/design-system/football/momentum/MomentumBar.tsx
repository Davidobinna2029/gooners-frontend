"use client";

interface Props {
  home: number;
  away: number;
}

export default function MomentumBar({
  home,
  away,
}: Props) {
  return (
    <div className="w-full">

      <div className="mb-2 flex justify-between text-xs font-semibold text-neutral-600">

        <span>Pressure</span>

        <span>
          {Math.round(home)}%
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-neutral-200">

        <div
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-red-600
            to-red-400
            transition-all
            duration-700
            ease-out
          "
          style={{
            width: `${home}%`,
          }}
        />

      </div>

    </div>
  );
}