"use client";

import type {
  ShotMapEvent,
} from "@/src/lib/football/analytics/shotMapEngine";


interface Props {

  shots: ShotMapEvent[];

  homeTeamId: number;

}


export default function ShotMap({
  shots,
  homeTeamId,
}: Props) {


  return (

    <section
      className="
        rounded-xl
        border
        bg-green-900
        p-5
      "
    >

      <h3
        className="
          mb-4
          font-bold
          text-white
        "
      >
        Shot Map
      </h3>


      <div
        className="
          relative
          h-[320px]
          overflow-hidden
          rounded-lg
          border
          border-white/30
        "
      >

        {shots.map((shot) => (

          <div

            key={shot.id}

            className={`
              absolute
              h-4
              w-4
              rounded-full
              ${
                shot.teamId === homeTeamId
                  ? "bg-red-500"
                  : "bg-white"
              }
              ${
                shot.outcome === "goal"
                  ? "ring-4 ring-yellow-400"
                  : ""
              }
            `}

            style={{

              left: `${shot.x}%`,

              top: `${shot.y}%`,

            }}

            title={
              `${shot.minute}' ${
                shot.playerName ?? "Shot"
              }`
            }

          />

        ))}


      </div>


    </section>

  );

}