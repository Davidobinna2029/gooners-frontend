"use client";

interface Props {

  home: number;

  draw: number;

  away: number;

}

export default function WinProbability({
  home,
  draw,
  away,
}: Props) {

  return (

    <section
      className="
        rounded-xl
        border
        bg-white
        p-5
        shadow-sm
      "
    >

      <h3
        className="
          mb-5
          font-bold
        "
      >
        Win Probability
      </h3>

      <ProbabilityBar
        label="Home Win"
        value={home}
        color="#DC2626"
      />

      <ProbabilityBar
        label="Draw"
        value={draw}
        color="#6B7280"
      />

      <ProbabilityBar
        label="Away Win"
        value={away}
        color="#2563EB"
      />

    </section>

  );

}

function ProbabilityBar({

  label,

  value,

  color,

}: {

  label: string;

  value: number;

  color: string;

}) {

  return (

    <div className="mb-5">

      <div
        className="
          mb-2
          flex
          justify-between
          text-sm
          font-semibold
        "
      >

        <span>{label}</span>

        <span>{value}%</span>

      </div>

      <div
        className="
          h-3
          overflow-hidden
          rounded-full
          bg-neutral-200
        "
      >

        <div
          className="h-full transition-all duration-700"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />

      </div>

    </div>

  );

}