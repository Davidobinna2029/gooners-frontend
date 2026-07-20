"use client";

interface Props {

  home: number;

  away: number;

}

export default function BallProgression({

  home,

  away,

}: Props) {

  const total =
    home + away;

  const homePct =
    total
      ? (home / total) * 100
      : 50;

  const awayPct =
    100 - homePct;

  return (

    <div className="rounded-xl border bg-white p-4 shadow-sm">

      <h3 className="mb-3 font-semibold">

        Ball Progression

      </h3>

      <div className="mb-3 flex justify-between">

        <div className="text-center">

          <p className="text-sm text-neutral-500">

            Home

          </p>

          <p className="text-2xl font-bold">

            {home}

          </p>

        </div>

        <div className="text-center">

          <p className="text-sm text-neutral-500">

            Away

          </p>

          <p className="text-2xl font-bold">

            {away}

          </p>

        </div>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-neutral-200">

        <div
          className="h-full bg-red-600"
          style={{
            width: `${homePct}%`,
          }}
        />

      </div>

      <div className="mt-2 flex justify-between text-xs text-neutral-500">

        <span>

          {homePct.toFixed(0)}%

        </span>

        <span>

          {awayPct.toFixed(0)}%

        </span>

      </div>

    </div>

  );

}