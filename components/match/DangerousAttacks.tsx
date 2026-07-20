"use client";

interface Props {
  home: number;
  away: number;
}

export default function DangerousAttacks({

  home,

  away,

}: Props) {

  const total = home + away;

  const homePct =
    total
      ? (home / total) * 100
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
        Dangerous Attacks
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
            {home}
          </p>

        </div>

        <div>

          <p className="text-xs text-neutral-500">
            Away
          </p>

          <p className="text-2xl font-bold">
            {away}
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
        Possessions that generated sustained attacking threat.
      </p>

    </section>

  );

}