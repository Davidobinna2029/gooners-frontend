"use client";

interface Props {

  home: number;

  away: number;

}

export default function FieldTilt({

  home,

  away,

}: Props) {

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

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
        "
      >

        <h3
          className="
            text-base
            font-semibold
          "
        >
          Field Tilt
        </h3>

        <span
          className="
            text-xs
            text-neutral-500
          "
        >
          Attacking Territory
        </span>

      </div>

      <div
        className="
          mb-3
          flex
          justify-between
          text-sm
          font-medium
        "
      >

        <span>
          Home {home}%
        </span>

        <span>
          Away {away}%
        </span>

      </div>

      <div
        className="
          h-4
          overflow-hidden
          rounded-full
          bg-neutral-200
        "
      >

        <div
          className="flex h-full"
        >

          <div
            className="
              bg-red-600
              transition-all
              duration-500
            "
            style={{
              width: `${home}%`,
            }}
          />

          <div
            className="
              bg-blue-600
              transition-all
              duration-500
            "
            style={{
              width: `${away}%`,
            }}
          />

        </div>

      </div>

      <div
        className="
          mt-3
          text-xs
          text-neutral-500
        "
      >

        Estimates which team has controlled attacking territory
        based on weighted attacking actions.

      </div>

    </section>

  );

}