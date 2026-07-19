"use client";

interface Props {
  pressure: number;
}

export default function PressureMeter({
  pressure,
}: Props) {

  const color =
    pressure >= 80
      ? "bg-red-600"
      : pressure >= 60
      ? "bg-orange-500"
      : pressure >= 40
      ? "bg-yellow-400"
      : "bg-emerald-500";

  return (

    <div className="rounded-xl border bg-white p-4 shadow-sm">

      <div className="mb-2 flex items-center justify-between">

        <h3 className="text-sm font-bold">

          Live Pressure

        </h3>

        <span className="text-sm font-semibold">

          {Math.round(pressure)}%

        </span>

      </div>

      <div className="h-4 overflow-hidden rounded-full bg-neutral-200">

        <div
          className={`
            h-full
            transition-all
            duration-700
            ease-out
            ${color}
          `}
          style={{
            width: `${pressure}%`,
          }}
        />

      </div>

    </div>

  );

}