"use client";

interface PlayerMarkerProps {
  number?: number;

  name: string;

  captain?: boolean;

  selected?: boolean;

  yellowCard?: boolean;

  redCard?: boolean;

  injured?: boolean;

  glowing?: boolean;
}

export default function PlayerMarker({
  number,
  name,
  captain = false,
  selected = false,
  yellowCard = false,
  redCard = false,
  injured = false,
  glowing = false,
}: PlayerMarkerProps) {

  return (

    <div className="flex flex-col items-center">

      <div
        className={`
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border-2
          border-white
          text-sm
          font-bold
          text-white
          transition-all
          duration-300

          ${
            redCard
              ? "bg-red-600"
              : yellowCard
              ? "bg-yellow-500 text-black"
              : "bg-red-700"
          }

          ${
            selected
              ? "scale-110 ring-4 ring-white"
              : ""
          }

          ${
            glowing
              ? "animate-pulse shadow-[0_0_18px_rgba(255,255,255,0.9)]"
              : ""
          }
        `}
      >

        {number ?? ""}

        {captain && (

          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-4
              w-4
              items-center
              justify-center
              rounded-full
              bg-yellow-400
              text-[10px]
              font-bold
              text-black
            "
          >
            C
          </span>

        )}

        {injured && (

          <span
            className="
              absolute
              -bottom-1
              -right-1
              h-3
              w-3
              rounded-full
              bg-red-500
            "
          />

        )}

      </div>

      <span
        className="
          mt-1
          max-w-[60px]
          truncate
          text-center
          text-[11px]
          font-medium
          text-white
        "
      >
        {name}
      </span>

    </div>

  );

}