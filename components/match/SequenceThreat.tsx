"use client";

interface Props {

  home: number;

  away: number;

}

export default function SequenceThreat({

  home,

  away,

}: Props) {

  const total = home + away;

  const homePct =
    total > 0
      ? (home / total) * 100
      : 50;

  const awayPct =
    total > 0
      ? (away / total) * 100
      : 50;

  return (

    <section
      className="
        rounded-xl
        border
        bg-white
        p-4
        shadow-sm
      "
    >

      <h3
        className="
          mb-4
          text-base
          font-semibold
        "
      >
        Sequence Threat
      </h3>

      <div
        className="
          mb-4
          h-3
          overflow-hidden
          rounded-full
          bg-neutral-200
        "
      >

        <div
          className="
            h-full
            bg-red-600
          "
          style={{
            width: `${homePct}%`,
          }}
        />

      </div>

      <div
        className="
          flex
          justify-between
          text-center
        "
      >

        <div>

          <p className="text-xs text-neutral-500">
            Home
          </p>

          <p className="text-2xl font-bold">
            {home.toFixed(2)}
          </p>

        </div>

        <div>

          <p className="text-xs text-neutral-500">
            Away
          </p>

          <p className="text-2xl font-bold">
            {away.toFixed(2)}
          </p>

        </div>

      </div>

      <p
        className="
          mt-4
          text-center
          text-xs
          text-neutral-500
        "
      >
        Total attacking threat generated across each possession sequence.
      </p>

    </section>

  );

}