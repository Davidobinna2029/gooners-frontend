"use client";

interface Props {

  home: number;

  away: number;

}

export default function ControlIndex({

  home,

  away,

}: Props) {

  const total = home + away;

  const homePct =

    total > 0

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

      <div

        className="
          mb-4
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

          Control Index

        </h3>

        <span

          className="
            rounded-full
            bg-red-100
            px-2
            py-1
            text-xs
            font-medium
            text-red-700
          "

        >

          Overall Match Control

        </span>

      </div>

      <div

        className="
          mb-5
          h-4
          overflow-hidden
          rounded-full
          bg-neutral-200
        "

      >

        <div

          className="
            h-full
            bg-red-600
            transition-all
          "

          style={{

            width: `${homePct}%`,

          }}

        />

      </div>

      <div

        className="
          grid
          grid-cols-2
          gap-6
          text-center
        "

      >

        <div>

          <p

            className="
              text-xs
              uppercase
              tracking-wide
              text-neutral-500
            "

          >

            Home

          </p>

          <p

            className="
              mt-2
              text-4xl
              font-bold
            "

          >

            {home.toFixed(1)}

          </p>

        </div>

        <div>

          <p

            className="
              text-xs
              uppercase
              tracking-wide
              text-neutral-500
            "

          >

            Away

          </p>

          <p

            className="
              mt-2
              text-4xl
              font-bold
            "

          >

            {away.toFixed(1)}

          </p>

        </div>

      </div>

      <p

        className="
          mt-5
          text-center
          text-xs
          text-neutral-500
        "

      >

        A weighted rating combining possession value, sequence threat,
        dangerous attacks, tempo, field tilt and pressing intensity to
        estimate which team controlled the match.

      </p>

    </section>

  );

}