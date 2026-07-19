"use client";

import type {
  PassNetwork,
} from "@/src/lib/football/analytics/passNetworkEngine";

interface Props {

  network: PassNetwork;

}

export default function PassNetwork({
  network,
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
          mb-4
          font-bold
        "
      >
        Pass Network
      </h3>

      <div
        className="
          relative
          h-[360px]
          overflow-hidden
          rounded-xl
          bg-green-900
        "
      >

        <svg
          className="
            absolute
            inset-0
            h-full
            w-full
          "
        >

          {network.connections.map(
            (connection, index) => {

              const from =
                network.nodes.find(
                  (player) =>
                    player.id ===
                    connection.from
                );

              const to =
                network.nodes.find(
                  (player) =>
                    player.id ===
                    connection.to
                );

              if (
                !from ||
                !to
              ) {
                return null;
              }

              return (

                <line
                  key={index}

                  x1={`${from.x}%`}
                  y1={`${from.y}%`}

                  x2={`${to.x}%`}
                  y2={`${to.y}%`}

                  stroke="white"

                  strokeWidth={
                    Math.max(
                      1,
                      connection.count / 8
                    )
                  }

                  opacity="0.55"
                />

              );

            }

          )}

        </svg>

        {network.nodes.map(
          (player) => (

            <div

              key={player.id}

              className="
                absolute
                flex
                -translate-x-1/2
                -translate-y-1/2
                flex-col
                items-center
              "

              style={{

                left:
                  `${player.x}%`,

                top:
                  `${player.y}%`,

              }}

            >

              <div
                className="
                  h-5
                  w-5
                  rounded-full
                  border-2
                  border-white
                  bg-red-600
                "
              />

              <span
                className="
                  mt-1
                  rounded
                  bg-black/70
                  px-2
                  py-0.5
                  text-[10px]
                  text-white
                "
              >
                {player.name}
              </span>

            </div>

          )

        )}

      </div>

    </section>

  );

}